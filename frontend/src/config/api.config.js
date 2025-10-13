// Configuração de URLs da API
const API_CONFIG = {
  // URL base da API (sem /api no final)
  BASE_URL: process.env.REACT_APP_BASE_URL || 'http://localhost:5000',
  
  // URL da API (com /api no final)
  API_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
};

export default API_CONFIG;

