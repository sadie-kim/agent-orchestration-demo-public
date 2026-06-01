# Server Deployment Guide

This server hosts the demo page and provides optional same-origin API routes.

## Default Public Mode

For a public portfolio deployment, use:

```bash
ENABLE_LIVE_GAS=false
```

In this mode:

- OpenAI calls can run through the server if `OPENAI_API_KEY` is set.
- Gmail, Google Docs, and Google Calendar actions are visual simulations.
- `/api/gas` refuses live side effects.

## Optional Controlled Live Mode

Only enable live Google actions for a private or tightly controlled demo:

```bash
ENABLE_LIVE_GAS=true
GAS_ENDPOINT=https://script.google.com/macros/s/.../exec
GAS_TOKEN=replace-me
ALLOWED_EMAIL_RECIPIENTS=your-demo-inbox@example.com
DEFAULT_EMAIL_RECIPIENT=your-demo-inbox@example.com
```

The Node server enforces the recipient allowlist before forwarding `send_email`
or `create_event` to Google Apps Script.

For additional protection, set:

```bash
DEMO_ACCESS_TOKEN=some-long-random-value
```

When this is set, API calls must include `x-demo-access-token`.

## Google Apps Script Properties

If you deploy `scripts/google-apps-script.js`, set these Script Properties:

```text
TOKEN=<same value as GAS_TOKEN>
ALLOWED_EMAIL_RECIPIENTS=your-demo-inbox@example.com
CALENDAR_ID=primary
SENDER_NAME=Agent Orchestration Demo
```

`TOKEN` is required. The script intentionally has no default token.

## Local Run

```bash
cp .env.example .env
npm install
export $(grep -v '^#' .env | xargs)
npm start
```

Open `http://localhost:3000`.
