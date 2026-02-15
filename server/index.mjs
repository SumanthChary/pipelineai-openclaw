import { createServer } from "node:http";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { Resend } from "resend";

const DEFAULT_WINDOWS_BRIDGE = path.join(
  "C:",
  "Users",
  "amgot",
  "pipelineai",
  "openclaw-bridge",
  "requests",
);
const DEFAULT_DEV_BRIDGE = path.join(process.cwd(), "tmp", "openclaw-bridge", "requests");

const requestsDir = process.env.OPENCLAW_BRIDGE_DIR || (process.platform === "win32" ? DEFAULT_WINDOWS_BRIDGE : DEFAULT_DEV_BRIDGE);
const port = Number(process.env.API_PORT || process.env.PORT || 8787);
const maxBodySize = Number(process.env.MAX_REQUEST_SIZE || 1024 * 1024);
const resendApiKey = process.env.RESEND_API_KEY;
const resendFromEmail = process.env.RESEND_FROM_EMAIL;
const resendFallbackTo = process.env.RESEND_NOTIFY_EMAIL;
const resendClient = resendApiKey ? new Resend(resendApiKey) : null;

const respond = (res, statusCode, payload) => {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": process.env.CORS_ORIGIN || "*",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(JSON.stringify(payload));
};

const ensureRequestsDir = async () => {
  await mkdir(requestsDir, { recursive: true });
};

const readJsonBody = (req) =>
  new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];

    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > maxBodySize) {
        reject(new Error("Payload too large"));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });

    req.on("end", () => {
      try {
        const body = Buffer.concat(chunks).toString("utf8");
        resolve(body.length ? JSON.parse(body) : {});
      } catch (err) {
        reject(new Error("Invalid JSON payload"));
      }
    });

    req.on("error", (err) => reject(err));
  });

const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const sendResendNotification = async ({ requestId, campaignData }) => {
  if (!resendClient || !resendFromEmail) {
    return;
  }

  const toAddress = campaignData.contactEmail || resendFallbackTo;
  if (!toAddress) {
    console.warn("[resend] Skipping email because no contactEmail or RESEND_NOTIFY_EMAIL is set");
    return;
  }

  const campaignLabel = campaignData.campaignName || requestId;
  const subject = `OpenClaw campaign queued: ${campaignLabel}`;

  const summaryRows = [
    ["Campaign", campaignData.campaignName],
    ["Company", campaignData.companyName],
    ["Target persona", campaignData.targetPersona],
    ["Offer", campaignData.offer],
  ].filter(([, value]) => Boolean(value));

  const htmlSummary = summaryRows
    .map(([label, value]) => `<tr><td style="padding:4px 8px;font-weight:600;">${label}</td><td style="padding:4px 8px;">${escapeHtml(value)}</td></tr>`)
    .join("");

  const htmlBody = `
    <p>OpenClaw just queued your campaign <strong>${escapeHtml(campaignLabel)}</strong>.</p>
    <p>Tracking ID: <code>${escapeHtml(requestId)}</code></p>
    ${htmlSummary ? `<table style="border-collapse:collapse;margin-top:12px;">${htmlSummary}</table>` : ""}
    <p>You can monitor progress from your OpenClaw worker. This is an automated confirmation.</p>
  `;

  const textSummary = summaryRows
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n");

  try {
    await resendClient.emails.send({
      from: resendFromEmail,
      to: [toAddress],
      subject,
      html: htmlBody,
      text: `OpenClaw queued your campaign ${campaignLabel}\nTracking ID: ${requestId}\n${textSummary}`,
    });
  } catch (error) {
    console.error("[resend] Failed to send notification", error);
  }
};

const server = createServer(async (req, res) => {
  try {
    if (req.method === "OPTIONS") {
      respond(res, 204, { success: true });
      return;
    }

    const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);

    if (req.method === "POST" && url.pathname === "/api/campaigns/submit") {
      const campaignData = await readJsonBody(req);

      if (!campaignData || typeof campaignData !== "object") {
        throw new Error("Campaign payload must be an object");
      }

      await ensureRequestsDir();

      const requestId = `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
      const requestPayload = {
        id: requestId,
        action: "run_campaign",
        data: campaignData,
        timestamp: new Date().toISOString(),
      };

      const filePath = path.join(requestsDir, `campaign-${requestId}.json`);
      await writeFile(filePath, JSON.stringify(requestPayload, null, 2), "utf8");

      void sendResendNotification({ requestId, campaignData });

      respond(res, 200, {
        success: true,
        campaignId: requestId,
        message: "Campaign submitted! Results will be ready in 2-5 minutes.",
      });
      return;
    }

    respond(res, 404, { success: false, error: "Not found" });
  } catch (error) {
    console.error("[campaigns-submit]", error);
    respond(res, 500, { success: false, error: error.message });
  }
});

server.listen(port, "0.0.0.0", () => {
  console.log(`OpenClaw bridge API listening on http://localhost:${port}`);
  console.log(`Writing bridge requests to: ${requestsDir}`);
});
