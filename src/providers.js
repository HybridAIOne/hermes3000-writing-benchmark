'use strict';
/**
 * Provider calls. Every call returns
 *   { text, usage: { in, out, thinking }, finish, reportedModel, latencyMs }
 * and `json` instead of `text` for structured judge calls.
 *
 * Models are called directly at their provider (or via OpenRouter) so anyone can reproduce
 * a run with their own keys. Thinking/reasoning tokens are counted as output everywhere,
 * because that is how every provider bills them.
 */

const ENDPOINTS = {
  openai: 'https://api.openai.com/v1/chat/completions',
  openrouter: 'https://openrouter.ai/api/v1/chat/completions',
  hemmingway: 'https://hemmingway.io/v1/chat/completions',
  anthropic: 'https://api.anthropic.com/v1/messages',
  google: (model) =>
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
};

const KEYS = {
  openai: 'OPENAI_API_KEY',
  openrouter: 'OPENROUTER_API_KEY',
  hemmingway: 'HEMMINGWAY_API_KEY',
  anthropic: 'ANTHROPIC_API_KEY',
  google: 'GOOGLE_API_KEY',
};

function apiKey(provider) {
  const k = process.env[KEYS[provider]];
  if (!k) throw new Error(`${KEYS[provider]} is not set`);
  return k;
}

// node:https rather than fetch: Node's fetch (undici) gives up after 300 s without response
// headers ("fetch failed"), whatever the AbortSignal says — and a model on its highest thinking
// level can take longer than that before the first byte. Here only timeoutMs applies.
const https = require('https');
function post(url, headers, body, timeoutMs) {
  const data = JSON.stringify(body);
  return new Promise((resolve, reject) => {
    const req = https.request(
      url,
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'content-length': Buffer.byteLength(data),
          ...headers,
        },
      },
      (res) => {
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => {
          const raw = Buffer.concat(chunks).toString('utf8');
          if (res.statusCode < 200 || res.statusCode >= 300)
            return reject(new Error(`${res.statusCode} ${raw.slice(0, 400)}`));
          try {
            resolve(JSON.parse(raw));
          } catch (e) {
            reject(new Error(`invalid JSON: ${raw.slice(0, 200)}`));
          }
        });
      }
    );
    req.setTimeout(timeoutMs, () => req.destroy(new Error(`timeout after ${timeoutMs} ms`)));
    req.on('error', reject);
    req.end(data);
  });
}

// --- OpenAI-compatible (OpenAI, OpenRouter) ------------------------------------------------

async function callOpenAICompat(provider, m, { system, prompt, maxTokens, timeoutMs, schema }) {
  const messages = [];
  if (system) messages.push({ role: 'system', content: system });
  messages.push({ role: 'user', content: prompt });
  const body = { model: m.model, messages, ...(m.params || {}) };
  if (provider === 'openai') body.max_completion_tokens = maxTokens;
  else body.max_tokens = maxTokens;
  if (schema) {
    body.response_format = {
      type: 'json_schema',
      json_schema: { name: 'verdict', strict: true, schema },
    };
  }
  const headers = { authorization: `Bearer ${apiKey(provider)}` };
  if (provider === 'openrouter') {
    headers['HTTP-Referer'] = 'https://hermes3000.ai';
    headers['X-Title'] = 'hermes3000 Writing Benchmark';
  }
  const d = await post(ENDPOINTS[provider], headers, body, timeoutMs);
  const msg = d.choices?.[0]?.message || {};
  const u = d.usage || {};
  return {
    text: (msg.content || '').trim(),
    usage: {
      in: u.prompt_tokens || 0,
      out: u.completion_tokens || 0,
      thinking: u.completion_tokens_details?.reasoning_tokens ?? null,
    },
    finish: d.choices?.[0]?.finish_reason,
    reportedModel: d.model,
    // OpenRouter spreads one model over several hosts, which may serve it differently.
    upstream: d.provider || null,
  };
}

// --- Anthropic ------------------------------------------------------------------------------

async function callAnthropic(m, { system, prompt, maxTokens, timeoutMs, schema }) {
  const body = {
    model: m.model,
    max_tokens: maxTokens,
    messages: [{ role: 'user', content: prompt }],
    ...(m.params || {}),
  };
  if (system) body.system = system;
  if (schema) {
    // Structured outputs. A forced tool call (tool_choice) is rejected by models that
    // think by default (Opus 5.5), output_config.format is accepted by all of them.
    body.output_config = { format: { type: 'json_schema', schema } };
  }
  const d = await post(
    ENDPOINTS.anthropic,
    { 'x-api-key': apiKey('anthropic'), 'anthropic-version': '2023-06-01' },
    body,
    timeoutMs
  );
  const text = (d.content || [])
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('')
    .trim();
  return {
    text,
    json: schema ? JSON.parse(text) : undefined,
    usage: {
      in: d.usage?.input_tokens || 0,
      out: d.usage?.output_tokens || 0,
      thinking: d.usage?.output_tokens_details?.thinking_tokens ?? null,
    },
    finish: d.stop_reason,
    reportedModel: d.model,
  };
}

// --- Google Gemini --------------------------------------------------------------------------

async function callGoogle(m, { system, prompt, maxTokens, timeoutMs, schema }) {
  const generationConfig = {
    maxOutputTokens: maxTokens,
    ...((m.params && m.params.generationConfig) || {}),
  };
  if (schema) {
    generationConfig.responseMimeType = 'application/json';
    generationConfig.responseJsonSchema = schema;
  }
  const body = { contents: [{ role: 'user', parts: [{ text: prompt }] }], generationConfig };
  if (system) body.systemInstruction = { parts: [{ text: system }] };
  const d = await post(
    ENDPOINTS.google(m.model),
    { 'x-goog-api-key': apiKey('google') },
    body,
    timeoutMs
  );
  const cand = d.candidates?.[0] || {};
  const u = d.usageMetadata || {};
  const thinking = u.thoughtsTokenCount || 0;
  const text = (cand.content?.parts || [])
    .filter((p) => !p.thought)
    .map((p) => p.text || '')
    .join('')
    .trim();
  return {
    text,
    json: schema ? JSON.parse(text) : undefined,
    // Gemini reports thoughts separately from candidates; both are billed as output.
    usage: { in: u.promptTokenCount || 0, out: (u.candidatesTokenCount || 0) + thinking, thinking },
    finish: cand.finishReason,
    reportedModel: d.modelVersion,
  };
}

/**
 * Call a model.
 * @param {object} m - model spec from models.yaml / spec.yaml judges
 * @param {object} req - { system, prompt, maxTokens, timeoutMs, schema? }
 */
async function callModel(m, req) {
  const start = Date.now();
  let r;
  if (m.provider === 'openai' || m.provider === 'openrouter' || m.provider === 'hemmingway')
    r = await callOpenAICompat(m.provider, m, req);
  else if (m.provider === 'anthropic') r = await callAnthropic(m, req);
  else if (m.provider === 'google') r = await callGoogle(m, req);
  else throw new Error(`unknown provider ${m.provider}`);
  if (req.schema && r.json === undefined) r.json = JSON.parse(r.text);
  r.latencyMs = Date.now() - start;
  return r;
}

/** USD cost of a call from the model's price table. */
function costOf(m, usage) {
  if (!m.price) return null;
  return (usage.in * m.price.in + usage.out * m.price.out) / 1e6;
}

module.exports = { callModel, costOf };
