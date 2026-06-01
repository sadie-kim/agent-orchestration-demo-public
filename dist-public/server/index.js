const express = require('express');
const path = require('path');

const app = express();
const port = Number(process.env.PORT || 3000);
const demoHtml = path.join(__dirname, '..', 'demo', 'agent-orchestration.html');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const OPENAI_CHAT_MODEL = process.env.OPENAI_CHAT_MODEL || 'gpt-4o';
const OPENAI_SEARCH_MODEL = process.env.OPENAI_SEARCH_MODEL || OPENAI_CHAT_MODEL;
const GAS_ENDPOINT = process.env.GAS_ENDPOINT || '';
const GAS_TOKEN = process.env.GAS_TOKEN || '';
const ENABLE_LIVE_GAS = parseBoolean(process.env.ENABLE_LIVE_GAS, false);
const ALLOWED_GAS_ACTIONS = parseCsv(process.env.ALLOWED_GAS_ACTIONS || 'create_doc,send_email,create_event');
const ALLOWED_EMAIL_RECIPIENTS = parseCsv(process.env.ALLOWED_EMAIL_RECIPIENTS);
const DEFAULT_EMAIL_RECIPIENT = process.env.DEFAULT_EMAIL_RECIPIENT || ALLOWED_EMAIL_RECIPIENTS[0] || '';
const DEMO_FROM_NAME = process.env.DEMO_FROM_NAME || 'Agent Orchestration Demo';
const DEMO_ACCESS_TOKEN = process.env.DEMO_ACCESS_TOKEN || '';

app.set('trust proxy', true);
app.use(express.json({ limit: '256kb' }));

function parseBoolean(value, fallback) {
  if (value === undefined || value === null || value === '') return fallback;
  return ['1', 'true', 'yes', 'on'].includes(String(value).trim().toLowerCase());
}

function parseCsv(value) {
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase();
}

function isAllowedRecipient(value) {
  const email = normalizeEmail(value);
  return Boolean(email && ALLOWED_EMAIL_RECIPIENTS.map(normalizeEmail).includes(email));
}

function setSecurityHeaders(req, res, next) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
  next();
}

function createRateLimiter({ windowMs, max }) {
  const buckets = new Map();
  return (req, res, next) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const record = buckets.get(ip);

    if (!record || now > record.resetAt) {
      buckets.set(ip, { count: 1, resetAt: now + windowMs });
      return next();
    }

    if (record.count >= max) {
      const retryAfter = Math.ceil((record.resetAt - now) / 1000);
      res.setHeader('Retry-After', String(retryAfter));
      return res.status(429).json({ error: 'Rate limit exceeded. Please try again shortly.' });
    }

    record.count += 1;
    next();
  };
}

async function postJson(url, body, headers) {
  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  });

  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }

  return { ok: response.ok, status: response.status, data };
}

app.use(setSecurityHeaders);
app.use('/api', createRateLimiter({ windowMs: 15 * 60 * 1000, max: 80 }));

function requireDemoAccess(req, res, next) {
  if (!DEMO_ACCESS_TOKEN) return next();
  const token = req.get('x-demo-access-token') || '';
  if (token !== DEMO_ACCESS_TOKEN) {
    return res.status(401).json({ error: 'Demo access token is required.' });
  }
  next();
}

app.use('/api/openai', requireDemoAccess);
app.use('/api/gas', requireDemoAccess);

app.get('/healthz', (req, res) => {
  res.json({
    ok: true,
    openaiConfigured: Boolean(OPENAI_API_KEY),
    gasConfigured: Boolean(GAS_ENDPOINT && GAS_TOKEN),
    liveActionsEnabled: Boolean(ENABLE_LIVE_GAS && GAS_ENDPOINT && GAS_TOKEN)
  });
});

app.get('/api/config', (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.json({
    backend: true,
    openaiConfigured: Boolean(OPENAI_API_KEY),
    gasConfigured: Boolean(GAS_ENDPOINT && GAS_TOKEN),
    liveActionsEnabled: Boolean(ENABLE_LIVE_GAS && GAS_ENDPOINT && GAS_TOKEN),
    allowedGasActions: ENABLE_LIVE_GAS ? ALLOWED_GAS_ACTIONS : [],
    allowedEmailRecipients: ALLOWED_EMAIL_RECIPIENTS,
    defaultEmailRecipient: DEFAULT_EMAIL_RECIPIENT,
    demoFromName: DEMO_FROM_NAME,
    accessTokenRequired: Boolean(DEMO_ACCESS_TOKEN)
  });
});

app.post('/api/openai/chat', async (req, res) => {
  if (!OPENAI_API_KEY) {
    return res.status(503).json({ error: 'OpenAI API key is not configured on the server.' });
  }

  const system = typeof req.body?.system === 'string' ? req.body.system : '';
  const user = typeof req.body?.user === 'string' ? req.body.user : '';
  if (!system || !user) {
    return res.status(400).json({ error: 'system and user are required.' });
  }

  try {
    const { ok, status, data } = await postJson(
      'https://api.openai.com/v1/chat/completions',
      {
        model: OPENAI_CHAT_MODEL,
        max_tokens: 2000,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user }
        ]
      },
      {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`
      }
    );

    if (!ok) {
      return res.status(status).json({
        error: data?.error?.message || 'OpenAI chat request failed.'
      });
    }

    return res.json({
      content: data?.choices?.[0]?.message?.content || null
    });
  } catch (error) {
    return res.status(502).json({ error: error.message || 'OpenAI chat request failed.' });
  }
});

app.post('/api/openai/search', async (req, res) => {
  if (!OPENAI_API_KEY) {
    return res.status(503).json({ error: 'OpenAI API key is not configured on the server.' });
  }

  const system = typeof req.body?.system === 'string' ? req.body.system : '';
  const user = typeof req.body?.user === 'string' ? req.body.user : '';
  if (!system || !user) {
    return res.status(400).json({ error: 'system and user are required.' });
  }

  try {
    const { ok, status, data } = await postJson(
      'https://api.openai.com/v1/responses',
      {
        model: OPENAI_SEARCH_MODEL,
        input: [
          { role: 'system', content: system },
          { role: 'user', content: user }
        ],
        tools: [{ type: 'web_search_preview' }]
      },
      {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`
      }
    );

    if (!ok) {
      return res.status(status).json({
        error: data?.error?.message || 'OpenAI search request failed.'
      });
    }

    const text = (data.output || [])
      .filter((block) => block.type === 'message')
      .flatMap((message) => (message.content || []).filter((item) => item.type === 'output_text').map((item) => item.text))
      .join('\n');

    return res.json({ content: text || null });
  } catch (error) {
    return res.status(502).json({ error: error.message || 'OpenAI search request failed.' });
  }
});

app.post('/api/gas', async (req, res) => {
  if (!ENABLE_LIVE_GAS) {
    return res.status(403).json({ success: false, skipped: true, error: 'Live Google actions are disabled for this public demo.' });
  }

  if (!GAS_ENDPOINT || !GAS_TOKEN) {
    return res.status(503).json({ success: false, error: 'Google Apps Script is not configured on the server.' });
  }

  const action = typeof req.body?.action === 'string' ? req.body.action : '';
  const data = req.body?.data;
  if (!action) {
    return res.status(400).json({ success: false, error: 'action is required.' });
  }
  if (!ALLOWED_GAS_ACTIONS.includes(action)) {
    return res.status(403).json({ success: false, error: `Action is not enabled: ${action}` });
  }
  if (action === 'send_email' && !isAllowedRecipient(data?.to)) {
    return res.status(403).json({ success: false, error: 'Recipient is not allowed for this demo.' });
  }
  if (action === 'create_event') {
    const attendees = Array.isArray(data?.attendees) ? data.attendees : [];
    const blocked = attendees.filter((email) => !isAllowedRecipient(email));
    if (blocked.length > 0) {
      return res.status(403).json({ success: false, error: 'One or more event attendees are not allowed for this demo.' });
    }
  }

  try {
    const response = await fetch(GAS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ token: GAS_TOKEN, action, data })
    });

    const text = await response.text();
    let payload;
    try {
      payload = text ? JSON.parse(text) : {};
    } catch {
      payload = { success: false, error: 'Invalid GAS response', raw: text };
    }

    return res.status(response.ok ? 200 : 502).json(payload);
  } catch (error) {
    return res.status(502).json({ success: false, error: error.message || 'GAS request failed.' });
  }
});

app.get('/keys.local.js', (req, res) => {
  res.status(404).type('application/javascript').send('// unavailable in public deployments\n');
});

app.get(['/','/agent-orchestration.html'], (req, res) => {
  res.sendFile(demoHtml);
});

app.listen(port, () => {
  console.log(`Agent orchestration demo listening on http://localhost:${port}`);
});
