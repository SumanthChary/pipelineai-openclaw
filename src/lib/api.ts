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
}

export interface CampaignResult {
  successful: number;
  failed?: number;
  totalLeads: number;
  details?: unknown;
  runId?: string;
}

export async function runCampaign(data: CampaignData): Promise<CampaignResult> {
  const response = await fetch(API_ENDPOINTS.runCampaign, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

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
    const response = await fetch(API_ENDPOINTS.health);
    if (!response.ok) return false;
    const data = await response.json();
    return data?.status === "ok";
  } catch {
    return false;
  }
}

export async function requestMagicLink(email: string): Promise<void> {
  const response = await fetch(API_ENDPOINTS.magicLink, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw buildApiError(payload?.error || "Failed to request magic link", response.status);
  }
}
