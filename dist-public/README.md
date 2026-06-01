# Agent Orchestration Demo

Public-facing demo site for `sadie.kim`.

The app serves a single demo page and routes live AI requests through a small Node server so API keys stay on the server, not in the browser.

## What matters for production

```text
agent-orchestration-demo/
├── demo/
│   └── agent-orchestration.html
├── server/
│   ├── index.js
│   ├── Caddyfile
│   ├── agent-orchestration-demo.service
│   └── README.md
├── .env.example
├── package.json
└── scripts/google-apps-script.js
```

## Local run

```bash
cp .env.example .env
npm install
export $(grep -v '^#' .env | xargs)
npm start
```

Open [http://localhost:3000](http://localhost:3000).

## Production deployment

Use the files in [server/README.md](server/README.md):

- [server/index.js](server/index.js): same-origin API proxy + app server
- [server/Caddyfile](server/Caddyfile): reverse proxy example
- [server/agent-orchestration-demo.service](server/agent-orchestration-demo.service): `systemd` service example

The default distribution mode keeps live Gmail, Docs, and Calendar actions
disabled. Visitors can still run the visual demo and, if configured, live AI
generation. Enable Google side effects only for an allowlisted demo inbox.

## Build a minimal public bundle

If you want a clean folder for a public repo or direct server upload, run:

```bash
bash scripts/build-public-release.sh
```

That creates `dist-public/` with only deployable site files and excludes `slides/`, `demo/keys.local.js`, local logs, and other machine-specific content.

## Security notes

- Do not deploy `demo/keys.local.js`.
- Keep real keys only in server-side `.env`.
- If the old local key file was ever exposed, rotate those credentials.
- Keep `ENABLE_LIVE_GAS=false` for public portfolio use unless recipients are allowlisted.
- If `DEMO_ACCESS_TOKEN` is set, only people with that token can use live API routes.

## Presentation assets

`slides/` and related materials are presentation assets, not required for the live site.
