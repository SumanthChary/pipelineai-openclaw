import { API_ENDPOINTS } from "./config";

export interface ApiError extends Error {
  status?: number;
}

const buildApiError = (message: string, status?: number): ApiError => {
  const error = new Error(message) as ApiError;
  error.status = status;
  return error;
};

export const isApiError = (error: unknown): error is ApiError =>
  Boolean(error && typeof error === "object" && "status" in error);

export interface Lead {
  name: string;
  title: string;
  company: string;
  email: string;
}

export interface CampaignData {
  campaignName: string;
  emailTemplate: string;
  emailSubject: string;
  leads: Lead[];
  contactEmail?: string;
  submittedBy?: string;
  metadata?: Record<string, unknown>;
}

export interface CampaignResult {
  successful: number;
  failed?: number;
  totalLeads: number;
  details?: unknown;
  runId?: string;
}

/** Default headers needed for ngrok free-tier (skip the interstitial page). */
const NGROK_HEADERS: Record<string, string> = {
  "ngrok-skip-browser-warning": "true",
};

const fetchWithTimeout = async (
  input: RequestInfo | URL,
  init?: RequestInit,
  timeout = 30_000,
): Promise<Response> => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  const mergedHeaders = { ...NGROK_HEADERS, ...(init?.headers as Record<string, string> | undefined) };
  try {
    return await fetch(input, { ...(init || {}), headers: mergedHeaders, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
};

export async function runCampaign(data: CampaignData): Promise<CampaignResult> {
  let response: Response;
  try {
    response = await fetchWithTimeout(
      API_ENDPOINTS.runCampaign,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      },
      120_000, // 2 minutes — OpenClaw worker can take 60s+
    );
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new Error(
        "The campaign request timed out after 2 minutes. Make sure the OpenClaw worker is running on the bridge machine.",
      );
    }
    throw new Error(
      `Network error: unable to reach the campaign server. ${err instanceof Error ? err.message : ""}".trim()`,
    );
  }

  if (!response.ok) {
    const errorPayload = await response.text();
    throw new Error(`Campaign failed (${response.status}): ${errorPayload}`);
  }

  const result = await response.json();

  if (!result?.success) {
    throw new Error(result?.error || "Campaign failed");
  }

  return result.data;
}

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const response = await fetchWithTimeout(API_ENDPOINTS.health, undefined, 10_000);
    if (!response.ok) return false;
    const data = await response.json();
    return data?.status === "ok";
  } catch {
    return false;
  }
}
