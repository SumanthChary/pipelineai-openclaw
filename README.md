# PipelineAI × OpenClaw Frontend

>A React + Vite experience that pushes structured campaign requests straight into your local `openclaw-bridge` for execution by the OpenClaw worker.

## Overview

- **Autonomous SDR surface** – marketing site with a live CTA that drops JSON jobs into the OpenClaw request queue.
- **Bridge API** – lightweight Node server (no framework) that mirrors the reference `app/api/campaigns/submit` route and writes directly to disk.
- **Modern UI toolkit** – React 18, TypeScript, shadcn/ui, Tailwind, Radix primitives, and Lucide icons.
- **Production-ready scaffolding** – eslint, vitest, React Query, and a refreshed README so the team can onboard quickly.

## Architecture

1. **Web App** (Vite @ port 8080) renders the marketing surface plus the "Launch an autonomous sprint" form.
2. **Bridge API** (Node @ port 8787 by default) exposes `POST /api/campaigns/submit` and persists request payloads to `openclaw-bridge/requests`.
3. **OpenClaw Worker** (running on your laptop) polls the `requests` directory, processes the payload, and writes results back through your existing workflow.

```
Browser ──(fetch /api/campaigns/submit)──▶ Bridge API ──▶ openclaw-bridge/requests ──▶ OpenClaw worker
```

## Prerequisites

- Node.js 18+ (tested on 20.x).
- npm 9+.
- Access to the OpenClaw worker plus the `openclaw-bridge` directory on your machine.

## Getting Started

1. **Install dependencies**
	```sh
	npm install
	```
2. **Start the bridge API** (from a separate terminal)
	```sh
	OPENCLAW_BRIDGE_DIR="/absolute/path/to/openclaw-bridge/requests" npm run api
	```
3. **Start the frontend**
	```sh
	npm run dev
	```
4. Visit http://localhost:8080, open the CTA section, fill out the form, and your JSON job will appear under the bridge `requests` folder within seconds.

> 💡 Keep both processes running. The Vite dev server is proxied to the API via `/api` so your browser remains same-origin.

## Configuration

| Variable | Default | Purpose |
| --- | --- | --- |
| `OPENCLAW_BRIDGE_DIR` | `C:/Users/amgot/pipelineai/openclaw-bridge/requests` on Windows, otherwise `<repo>/tmp/openclaw-bridge/requests` | Absolute path to the folder where request JSON files should be written. |
| `API_PORT` / `PORT` | `8787` | TCP port for the Node bridge server. |
| `MAX_REQUEST_SIZE` | `1048576` (1 MB) | Optional safeguard for incoming payloads. |
| `CORS_ORIGIN` | `*` | Set if you need to restrict who can call the API. |
| `VITE_BRIDGE_API` | `http://localhost:8787` | Override if the API server lives on a different host during development. |
| `RESEND_API_KEY` | — | Optional. Enables transactional email confirmations via Resend. |
| `RESEND_FROM_EMAIL` | — | Required when `RESEND_API_KEY` is set. Must be a verified Resend sender. |
| `RESEND_NOTIFY_EMAIL` | — | Fallback recipient when a submission omits `contactEmail`. |

## Request Contract

- Endpoint: `POST /api/campaigns/submit`
- Body: arbitrary JSON describing the campaign. The UI ships the following shape:

```json
{
  "campaignName": "Outbound sprint",
  "companyName": "PipelineAI",
  "contactEmail": "ops@pipeline.ai",
  "targetPersona": "RevOps leaders at cloud-native SaaS companies",
  "offer": "Autonomous SDRs that qualify and book meetings end-to-end",
  "notes": "",
  "submittedFrom": "pipelineai-openclaw-ui"
}
```

- Storage: each submission becomes `campaign-<timestamp>-<rand>.json` inside `OPENCLAW_BRIDGE_DIR` with the wrapper `{ id, action: "run_campaign", data, timestamp }`.

## Email Confirmations (Resend)

- If you provide `RESEND_API_KEY` and `RESEND_FROM_EMAIL`, the bridge server automatically emails the submitter (`contactEmail`) the tracking ID once a request file is written.
- Missing `contactEmail`? Set `RESEND_NOTIFY_EMAIL` to send confirmations to an internal distribution list instead.
- Notifications use Resend's transactional API and do **not** block the HTTP response—failures are logged server-side.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Vite dev server @ http://localhost:8080 |
| `npm run build` | Production build |
| `npm run preview` | Preview the production build |
| `npm run api` | Starts the bridge API server |
| `npm run lint` | ESLint across the repo |
| `npm run test` | Vitest unit tests |

## Project Structure

```
├─ server/
│  └─ index.mjs          # Bridge API (writes OpenClaw request files)
├─ src/
│  ├─ components/
│  │  ├─ CampaignRequestForm.tsx  # CTA form hooked to /api/campaigns/submit
│  │  └─ ...
│  ├─ pages/
│  │  └─ Index.tsx       # Landing page composition
│  └─ App.tsx            # Router + providers
└─ ...
```

## Deployment Notes

- For production hosting you can continue to deploy the static site to Lovable/Vercel/Netlify.
- The bridge API is intentionally lightweight so it can run as a local daemon, a Docker sidecar, or a small VM/edge function. Ensure it has filesystem access to the same `openclaw-bridge` directory as your worker.
- When deploying the UI separately from the API, set `VITE_BRIDGE_API` to the reachable API base and configure your reverse proxy to forward `/api` accordingly.

## Roadmap

- Harden the API with authentication or signed payloads once backend work (Auth, user management, audit logs) is prioritized.
- Expand the CTA form with templates, saved personas, and connection to CRM destinations.

---

Questions or improvements? Open an issue or drop feedback in the OpenClaw Slack channel.
