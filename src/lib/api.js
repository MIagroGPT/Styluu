/**
 * Styluu API Client
 * Centralizes all HTTP calls to the Styluu Express backend.
 * In development: calls go to /api/* → proxied to http://localhost:3001 via vite.config.js
 * In production:  calls go to VITE_API_URL (e.g. https://styluu-api.easypanel.host)
 */

const PROD_API_URL = 'https://styluu-styluu-api.cyalcb.easypanel.host';
const BASE = (import.meta.env.VITE_API_URL || (import.meta.env.PROD ? PROD_API_URL : '')).replace(/\/$/, '');

async function request(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : {},
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

const get    = (path)         => request('GET',    path);
const post   = (path, body)   => request('POST',   path, body);
const put    = (path, body)   => request('PUT',    path, body);
const patch  = (path, body)   => request('PATCH',  path, body);
const del    = (path)         => request('DELETE', path);

// ─── Health ─────────────────────────────────────────────────────────────────
export const health = () => get('/api/health');

// ─── Venues ─────────────────────────────────────────────────────────────────
export const venuesApi = {
  list:       ()           => get('/api/venues'),
  get:        (id)         => get(`/api/venues/${id}`),
  upsert:     (id, data)   => put(`/api/venues/${id}`, data),
  remove:     (id)         => del(`/api/venues/${id}`),
  bulkInsert: (venues)     => post('/api/venues/bulk', venues),
};

// ─── Staff ──────────────────────────────────────────────────────────────────
export const staffApi = {
  list:       ()           => get('/api/staff'),
  create:     (data)       => post('/api/staff', data),
  update:     (id, data)   => put(`/api/staff/${id}`, data),
  remove:     (id)         => del(`/api/staff/${id}`),
  bulkInsert: (staff)      => post('/api/staff/bulk', staff),
};

// ─── Calendar Appointments ───────────────────────────────────────────────────
export const appointmentsApi = {
  list:        (filters)   => {
    const q = new URLSearchParams(filters || {}).toString();
    return get(`/api/appointments${q ? '?' + q : ''}`);
  },
  create:      (data)      => post('/api/appointments', data),
  update:      (id, data)  => patch(`/api/appointments/${id}`, data),
  remove:      (id)        => del(`/api/appointments/${id}`),
  clearAll:    ()          => del('/api/appointments'),
  bulkSettle:  (payload)   => patch('/api/appointments/bulk/settle', payload),
};

// ─── Client Bookings ─────────────────────────────────────────────────────────
export const bookingsApi = {
  list:    ()           => get('/api/bookings'),
  create:  (data)       => post('/api/bookings', data),
  update:  (id, data)   => patch(`/api/bookings/${id}`, data),
};

// ─── CRM Clients ─────────────────────────────────────────────────────────────
export const clientsApi = {
  list:    ()           => get('/api/clients'),
  create:  (data)       => post('/api/clients', data),
  update:  (id, data)   => patch(`/api/clients/${id}`, data),
};

// ─── Sales Transactions ───────────────────────────────────────────────────────
export const transactionsApi = {
  list:      (filters)  => {
    const q = new URLSearchParams(filters || {}).toString();
    return get(`/api/transactions${q ? '?' + q : ''}`);
  },
  create:    (data)     => post('/api/transactions', data),
  settle:    (id, data) => patch(`/api/transactions/${id}/settle`, data),
  clearAll:  ()         => del('/api/transactions'),
};

// ─── Payroll Settlements ──────────────────────────────────────────────────────
export const settlementsApi = {
  list:   ()      => get('/api/settlements'),
  create: (data)  => post('/api/settlements', data),
};

// ─── Retail Products ──────────────────────────────────────────────────────────
export const productsApi = {
  list:       ()         => get('/api/products'),
  update:     (id, data) => put(`/api/products/${id}`, data),
  bulkInsert: (products) => post('/api/products/bulk', products),
};
