# dist-public

Generated deployment bundle for the public `sadie.kim` site.

Included:

- `demo/agent-orchestration.html`
- `server/index.js`
- `server/Caddyfile`
- `server/agent-orchestration-demo.service`
- `.env.example`
- `package.json`
- `package-lock.json` when present
- `scripts/google-apps-script.js`

Excluded on purpose:

- `demo/keys.local.js`
- `slides/`
- `.playwright-cli/`
- `node_modules/`
- local SSH keys and machine-specific files

Default safety posture:

- Live Google actions are disabled unless `ENABLE_LIVE_GAS=true`.
- Email and calendar recipients must be allowlisted by the server and Apps Script.
- The Apps Script bridge requires a Script Property named `TOKEN`; there is no default token.
