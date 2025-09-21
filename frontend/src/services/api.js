import axios from 'axios';

function getUTMHeaders() {
  try {
    const utm = JSON.parse(localStorage.getItem('utm_data') || '{}');
    const headers = {};
    Object.entries(utm).forEach(([key, value]) => {
      if (value) {
        headers['x-' + key.replace(/_/g, '-')] = value;
        console.log(`📤 Header UTM: x-${key.replace(/_/g, '-')} = ${value}`);
      }
    });
    console.log('📤 Headers UTM enviados:', headers);
    return headers;
  } catch (e) {
    console.error('❌ Erro ao criar headers UTM:', e);
    return {};
  }
}

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://borracharoupa.fun/api',
  timeout: 30000,
});

// Interceptor para adicionar token automaticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers = { ...(config.headers || {}), ...getUTMHeaders() };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas de erro
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
