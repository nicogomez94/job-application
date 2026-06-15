const crypto = require('crypto');

const API_BASE_URL = 'https://api.mercadopago.com';
const DEFAULT_TIMEOUT_MS = 15000;

const normalizeUrl = (value) => String(value || '').trim().replace(/\/+$/, '');

const getAccessToken = () => {
  const token = process.env.MERCADO_PAGO_ACCESS_TOKEN;
  if (!token) {
    const error = new Error('MERCADO_PAGO_ACCESS_TOKEN no está configurado.');
    error.statusCode = 500;
    throw error;
  }
  return token;
};

const mercadoPagoRequest = async (path, options = {}) => {
  const {
    method = 'GET',
    body,
    idempotencyKey,
    timeoutMs = DEFAULT_TIMEOUT_MS,
  } = options;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
        'Content-Type': 'application/json',
        ...(idempotencyKey ? { 'X-Idempotency-Key': idempotencyKey } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    const text = await response.text();
    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch (_) {
      data = text ? { message: text } : null;
    }

    if (!response.ok) {
      const error = new Error(data?.message || data?.error || 'Error de Mercado Pago');
      error.statusCode = response.status;
      error.mercadoPagoResponse = data;
      throw error;
    }

    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      const timeoutError = new Error('Mercado Pago no respondió a tiempo.');
      timeoutError.statusCode = 504;
      throw timeoutError;
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
};

const getFrontendBackUrl = (path) => {
  const frontendUrl = normalizeUrl(process.env.FRONTEND_URL) || 'http://localhost:5173';
  return `${frontendUrl}${path}`;
};

const getWebhookUrl = () => {
  const explicitUrl = normalizeUrl(process.env.MERCADO_PAGO_WEBHOOK_URL);
  if (explicitUrl) return explicitUrl;

  const publicBackendUrl = normalizeUrl(process.env.BACKEND_PUBLIC_URL || process.env.API_PUBLIC_URL);
  if (!publicBackendUrl) return null;

  const base = /\/api$/i.test(publicBackendUrl)
    ? publicBackendUrl
    : `${publicBackendUrl}/api`;
  return `${base}/subscriptions/webhook/mercadopago?source_news=webhooks`;
};

const createPreapproval = async ({
  reason,
  externalReference,
  payerEmail,
  transactionAmount,
  currencyId,
  frequency,
  backUrl,
}) => {
  const notificationUrl = getWebhookUrl();
  const body = {
    reason,
    external_reference: externalReference,
    payer_email: payerEmail,
    auto_recurring: {
      frequency,
      frequency_type: 'months',
      transaction_amount: Number(transactionAmount),
      currency_id: currencyId,
    },
    back_url: backUrl,
    status: 'pending',
    ...(notificationUrl ? { notification_url: notificationUrl } : {}),
  };

  return mercadoPagoRequest('/preapproval', {
    method: 'POST',
    body,
    idempotencyKey: externalReference,
  });
};

const getPreapproval = (id) =>
  mercadoPagoRequest(`/preapproval/${encodeURIComponent(id)}`);

const updatePreapproval = (id, body) =>
  mercadoPagoRequest(`/preapproval/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body,
    idempotencyKey: `preapproval-update-${id}-${Date.now()}`,
  });

const cancelPreapproval = (id) => updatePreapproval(id, { status: 'canceled' });

const getAuthorizedPayment = (id) =>
  mercadoPagoRequest(`/authorized_payments/${encodeURIComponent(id)}`);

const searchAuthorizedPayments = (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.set(key, String(value));
    }
  });
  const suffix = query.toString() ? `?${query.toString()}` : '';
  return mercadoPagoRequest(`/authorized_payments/search${suffix}`);
};

const parseSignatureHeader = (value) => {
  const result = {};
  String(value || '')
    .split(',')
    .forEach((part) => {
      const [rawKey, rawValue] = part.split('=');
      if (rawKey && rawValue) result[rawKey.trim()] = rawValue.trim();
    });
  return result;
};

const normalizeWebhookDataId = (value) => {
  if (value === undefined || value === null) return '';
  const text = String(value);
  return /[a-z]/i.test(text) ? text.toLowerCase() : text;
};

const getWebhookDataId = (query = {}, body = {}) =>
  query['data.id'] || query.id || body?.data?.id || body?.id || '';

const verifyWebhookSignature = ({ headers = {}, query = {}, body = {} }) => {
  const secret = process.env.MERCADO_PAGO_WEBHOOK_SECRET;
  if (!secret) {
    return { ok: true, skipped: true };
  }

  const signature = headers['x-signature'];
  const requestId = headers['x-request-id'];
  if (!signature || !requestId) {
    return { ok: false, reason: 'missing_signature_headers' };
  }

  const parts = parseSignatureHeader(signature);
  if (!parts.ts || !parts.v1) {
    return { ok: false, reason: 'invalid_signature_header' };
  }

  const dataId = normalizeWebhookDataId(getWebhookDataId(query, body));
  const manifestParts = [];
  if (dataId) manifestParts.push(`id:${dataId};`);
  manifestParts.push(`request-id:${requestId};`);
  manifestParts.push(`ts:${parts.ts};`);
  const manifest = manifestParts.join('');

  const expected = crypto
    .createHmac('sha256', secret)
    .update(manifest)
    .digest('hex');

  const received = parts.v1;
  const ok =
    expected.length === received.length &&
    crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(received));

  return { ok, reason: ok ? null : 'signature_mismatch' };
};

module.exports = {
  cancelPreapproval,
  createPreapproval,
  getAuthorizedPayment,
  getFrontendBackUrl,
  getPreapproval,
  getWebhookDataId,
  getWebhookUrl,
  searchAuthorizedPayments,
  verifyWebhookSignature,
};
