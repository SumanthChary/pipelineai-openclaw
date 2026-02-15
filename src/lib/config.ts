// Centralized API configuration for remote OpenClaw worker
// The API_URL should point to the ngrok tunnel or local server running the OpenClaw bridge.
// Update this when your ngrok tunnel URL changes.
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8787";

export const API_ENDPOINTS = {
  health: `${API_URL}/api/health`,
  runCampaign: `${API_URL}/api/campaigns/run`,
} as const;
