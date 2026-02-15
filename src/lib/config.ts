// Centralized API configuration for remote OpenClaw worker
export const API_URL = "https://knaggy-katherina-unresplendently.ngrok-free.dev";

export const API_ENDPOINTS = {
  health: `${API_URL}/api/health`,
  runCampaign: `${API_URL}/api/campaigns/run`,
} as const;
