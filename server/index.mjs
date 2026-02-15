import { createServer } from "node:http";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { Resend } from "resend";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

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

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || null;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || null;
const supabaseAdminClient = supabaseUrl && supabaseServiceKey ? createSupabaseClient(supabaseUrl, supabaseServiceKey) : null;
const magicLinkRedirect = process.env.MAGIC_LINK_REDIRECT || `${process.env.PUBLIC_SITE_URL || "https://pipelineai-openclaw.lovable.app"}/dashboard`;

class HttpError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.name = "HttpError";
    this.statusCode = statusCode;
  }
}

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

  const randomNotification = () => `pipelineai+${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.com`;
  const toAddress = campaignData.contactEmail || resendFallbackTo || randomNotification();
  if (!campaignData.contactEmail && !resendFallbackTo) {
    console.warn("[resend] Using temporary notification alias", toAddress);
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

const ensureSupabaseAdmin = () => {
  if (!supabaseAdminClient) {
    throw new HttpError("Supabase service role key missing. Set SUPABASE_SERVICE_ROLE_KEY.", 500);
  }
};

const supabaseHealth = {
  lastChecked: 0,
  ok: false,
  error: "Supabase admin client not configured",
};

const SUPABASE_HEALTH_TTL = 60 * 1000;

const checkSupabaseAdmin = async ({ force = false } = {}) => {
  if (!supabaseAdminClient) {
    supabaseHealth.ok = false;
    supabaseHealth.error = "Supabase service role key missing";
    return supabaseHealth;
  }

  const shouldCheck = force || Date.now() - supabaseHealth.lastChecked > SUPABASE_HEALTH_TTL;
  if (!shouldCheck) {
    return supabaseHealth;
  }

  supabaseHealth.lastChecked = Date.now();
  try {
    await supabaseAdminClient.auth.admin.listUsers({ page: 1, perPage: 1 });
    supabaseHealth.ok = true;
    supabaseHealth.error = null;
  } catch (error) {
    supabaseHealth.ok = false;
    supabaseHealth.error = error?.message || "Unable to reach Supabase admin API";
  }

  return supabaseHealth;
};

const ensureResend = () => {
  if (!resendClient || !resendFromEmail) {
    throw new HttpError("Resend credentials missing. Set RESEND_API_KEY and RESEND_FROM_EMAIL.", 503);
  }
};

const createUserIfNeeded = async (email) => {
  ensureSupabaseAdmin();
  const { error } = await supabaseAdminClient.auth.admin.createUser({
    email,
    email_confirm: false,
  });

  if (error) {
    const alreadyExists = /already registered/i.test(error.message || "");
    if (!alreadyExists) {
      throw error;
    }
  }
};

const generateMagicLink = async (email) => {
  ensureSupabaseAdmin();

  const attempt = async () => {
    const health = await checkSupabaseAdmin({ force: true });
    if (!health.ok) {
      throw new HttpError(health.error || "Supabase admin unavailable", 500);
    }

    const { data, error } = await supabaseAdminClient.auth.admin.generateLink({
      type: "magiclink",
      email,
      options: { redirectTo: magicLinkRedirect },
    });

    if (error) {
      const message = error.message || "Unable to generate link";
      if (error.status === 401 || /requires a valid Bearer/i.test(message) || /invalid token/i.test(message)) {
        throw new HttpError("Invalid SUPABASE_SERVICE_ROLE_KEY. Use the service_role key from Project Settings → API.", 500);
      }
      if (error.code === "over_email_send_rate_limit" || /rate limit/i.test(message)) {
        throw new HttpError("Too many magic link requests. Please wait 60 seconds and try again.", 429);
      }
      if (/user.*not.*found/i.test(message)) {
        await createUserIfNeeded(email);
        return attempt();
      }
      throw error;
    }

    if (!data?.action_link) {
      throw new HttpError("Supabase did not return an action link", 500);
    }

    return data.action_link;
  };

  return attempt();
};

const sendMagicLinkEmail = async (email) => {
  ensureSupabaseAdmin();
  ensureResend();

  const normalizedEmail = email.toLowerCase();
  const actionLink = await generateMagicLink(normalizedEmail);

  try {
    await resendClient.emails.send({
      from: resendFromEmail,
      to: [normalizedEmail],
      subject: "Your Pipeline AI login link",
      html: `
        <p>Hey there,</p>
        <p>Tap the secure link below to sign in to Pipeline AI:</p>
        <p><a href="${actionLink}">Access Dashboard</a></p>
        <p>This link expires in 5 minutes. If you didn\'t request it, you can ignore this email.</p>
      `,
      text: `Sign in to Pipeline AI: ${actionLink}\nThis link expires in 5 minutes.`,
    });
  } catch (error) {
    console.error("[resend] magic link send failed", error);
    throw new HttpError("Unable to dispatch email via Resend. Check your API key/domain.", 502);
  }
};

const server = createServer(async (req, res) => {
  try {
    if (req.method === "OPTIONS") {
      respond(res, 204, { success: true });
      return;
    }

    const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);

    // ── Health check ─────────────────────────────────────────────
    if (req.method === "GET" && url.pathname === "/api/health") {
      respond(res, 200, {
        success: true,
        status: "ok",
        resendConfigured: Boolean(resendClient && resendFromEmail),
        supabaseConfigured: Boolean(supabaseAdminClient),
        timestamp: new Date().toISOString(),
      });
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/auth/status") {
      const supabaseStatus = await checkSupabaseAdmin({ force: true });
      const resendStatus = {
        ok: Boolean(resendClient && resendFromEmail),
        error: !resendClient || !resendFromEmail ? "Resend API key or from email missing" : null,
      };

      respond(res, 200, {
        success: true,
        supabase: supabaseStatus,
        resend: resendStatus,
      });
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/auth/magic-link") {
      try {
        const payload = await readJsonBody(req);
        const email = (payload?.email || "").toString().trim().toLowerCase();
        if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
          respond(res, 400, { success: false, error: "Valid email is required" });
          return;
        }

        await sendMagicLinkEmail(email);
        respond(res, 200, { success: true, message: "Magic link sent via Resend" });
      } catch (error) {
        const statusCode = typeof error?.statusCode === "number" ? error.statusCode : 500;
        const message = error?.message || "Unable to send magic link";
        console.error("[/api/auth/magic-link]", message);
        respond(res, statusCode, { success: false, error: message });
      }
      return;
    }

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
