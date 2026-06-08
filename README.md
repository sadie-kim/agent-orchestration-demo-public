# Agent Orchestration Demo

A public, single-page demo of a multi-agent workflow — a planner coordinates three
specialist agents (**Scout** → web research, **Forge** → document generation,
**Herald** → email & calendar) with an optional reviewer pass, then renders the run
live in a mock Gmail / Docs / Calendar UI.

**Live:** [sadie.kim/agent-orchestration](https://sadie.kim/agent-orchestration/) ·
runs in *simulation* out of the box, or *live* if you paste your own OpenAI key.

## Problem

Most "AI agent" demos are a chat box. That hides the parts that actually matter in a
real product: where do API keys live, what happens when an agent touches email or a
calendar, and how do you show live AI without either leaking a key into the browser
or paying for every anonymous visitor. I wanted a demo that is **safe to publish**,
**free to host**, and still **really runs** when someone wants to see it work.

## Approach

- **Two execution modes from one build.** With no key configured the frontend detects
  it (`/api/config` → `browser` mode) and falls back to a fully scripted *visual
  simulation* — zero cost, zero secrets. Paste an OpenAI key in the UI and the same
  page makes real calls; the key stays in memory in the browser and never hits a
  server I run.
- **Server proxy as an option, not a requirement.** `server/index.js` is a small
  same-origin Express proxy (key stays server-side, rate-limited, CSP + security
  headers) for deployments that want a managed key instead of BYOK.
- **External actions are gated, not faked-dangerous.** Gmail / Docs / Calendar are
  visual simulations by default. The optional Google Apps Script bridge only runs live
  side effects when `ENABLE_LIVE_GAS=true`, and enforces a recipient allowlist on
  *both* the Node layer and the Apps Script itself, plus a shared-secret token and a
  rate limit.
- **Output is treated as untrusted.** Model output is HTML-escaped before rendering,
  and a Content-Security-Policy restricts where the page can connect — so a bad
  generation can't exfiltrate the in-memory key.

## Trade-offs (and why)

- **Single self-contained HTML file** (CSS/JS/scenarios inline). Chosen so the demo is
  one static asset — trivial to host and to reason about for security. Cost: it's a
  large file and harder to maintain; a build step that emits a single file is the
  planned fix.
- **Fixed agent sequence** rather than fully dynamic planning. Chosen to keep the demo
  legible in ~60 seconds on stage. A dynamic plan→tool-call→observe loop is the next
  capability I'd add.
- **`gpt-4o` default, no streaming yet.** Output is generated then typed out for the
  demo feel. Real streaming + a model picker are on the roadmap.

## Roadmap

- [x] XSS-escape regression tests + CI (GitHub Actions)
- [x] Model selector (live mode) — `gpt-4o` no longer hardcoded
- [x] Dynamic tool-selection — the orchestrator routes per goal; scenarios declare a `path` and unused agents are skipped & dimmed
- [x] `prefers-reduced-motion`, ARIA-live activity feed, color-independent (▲/▼) metrics, keyboard focus styles
- [x] Bring-your-own Google bridge (connect real Docs/Gmail/Calendar — see below)
- [ ] Real token streaming (intentionally deferred — the doc renderer parses the full response into a metrics/callout layout, so streaming would break that output)
- [ ] Parser unit tests (the markdown→blocks parser is DOM-coupled)

---

## Connecting real Google (optional)

By default Gmail, Docs, and Calendar are **visual simulations** — no Google account or
setup required (ideal for a public demo or a talk). To run **real** Google actions with
your own account, deploy the Apps Script bridge and connect it from the setup screen:

1. Go to [script.google.com](https://script.google.com), create a project, and paste
   [scripts/google-apps-script.js](scripts/google-apps-script.js) into `Code.gs`.
2. **Deploy → New deployment → Web app** (Execute as: *you*, Who has access: *Anyone*).
   Copy the deployment URL (ends in `/exec`).
3. On first run, grant the OAuth consent (Gmail send, Docs, Calendar).
4. Set **Script Properties**: `TOKEN` (a random secret), `ALLOWED_EMAIL_RECIPIENTS`
   (comma-separated allowlist — only these addresses can be emailed), `CALENDAR_ID`,
   `SENDER_NAME`.
5. Open the demo, expand **"Connect your Google"** on the setup screen, and paste your
   web-app URL + token. Set **Recipient email** to an allowlisted address.

The URL + token stay in your browser (never sent to the demo's host). Actions run on
**your** Google account, and the recipient allowlist is enforced by your script (plus a
shared-secret token and a per-minute rate limit). With an OpenAI key + the bridge you get
real document **and** email **and** calendar; with the bridge but no key (simulation mode)
the document is created for real while email/calendar stay simulated. For a server-managed
alternative, set `ENABLE_LIVE_GAS=true` + `GAS_ENDPOINT`/`GAS_TOKEN` in the server `.env`
instead (see [server/README.md](server/README.md)).

---

## Deployment

The **public deployment is static** (e.g. Cloudflare Pages / any static host): just
the single `demo/agent-orchestration.html`. In that mode there is no server — the page
runs in BYOK `browser` mode. The Node server below is **optional**, for proxy-mode
deployments that manage the key server-side.

### Local run

```bash
cp .env.example .env
npm install
export $(grep -v '^#' .env | xargs)
npm start
```

Open [http://localhost:3000](http://localhost:3000).

### Optional server (proxy mode)

See [server/README.md](server/README.md):

- [server/index.js](server/index.js): same-origin API proxy + app server (CSP, rate
  limiting, recipient allowlist)
- [server/Caddyfile](server/Caddyfile): reverse proxy example
- [server/agent-orchestration-demo.service](server/agent-orchestration-demo.service): `systemd` example

### Build a minimal public bundle

```bash
bash scripts/build-public-release.sh
```

Writes `dist-public/` with only deployable files (excludes `slides/`,
`demo/keys.local.js`, local logs, etc.).

## Security notes

- Keep `ENABLE_LIVE_GAS=false` for public use unless recipients are allowlisted.
- In BYOK mode the OpenAI key lives only in the browser tab's memory — not persisted,
  not logged, not sent to any server I run.
- Do not deploy `demo/keys.local.js`; keep real keys only in server-side `.env`.
- Model output is HTML-escaped before rendering and constrained by a CSP.
- This is a **fictional demo** — "Meridian Wealth Advisory" and its data are made up.
