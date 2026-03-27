// services/api.js
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

async function request(path, options = {}, token = null) {
  const headers = { ...options.headers };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw { status: res.status, message: data.message || data.error || 'Error en la petición' };
  }

  return data;
}

// Auth
export const authApi = {
  login: (username, password) =>
    request('/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  register: (username, password) =>
    request('/register', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
};

// Products
export const productsApi = {
  getAll: (name = '') =>
    request(`/productos${name ? `?name=${encodeURIComponent(name)}` : ''}`),

  getOne: (id) =>
    request(`/productos/${id}`),

  create: (formData, token) =>
    request('/productos', { method: 'POST', body: formData }, token),

  update: (id, data, token) =>
    request(`/productos/${id}`, { method: 'PUT', body: JSON.stringify(data) }, token),

  delete: (id, token) =>
    request(`/productos/${id}`, { method: 'DELETE' }, token),
};

// Users
export const usersApi = {
  getAll: (token) =>
    request('/users', {}, token),

  create: (data, token) =>
    request('/users', { method: 'POST', body: JSON.stringify(data) }, token),

  update: (id, data, token) =>
    request(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }, token),

  delete: (id, token) =>
    request(`/users/${id}`, { method: 'DELETE' }, token),
};
