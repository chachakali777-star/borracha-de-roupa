import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { initUTMTracking, debugUTM } from './utils/utm';

initUTMTracking();

// Disponibilizar função de debug globalmente para testes
window.debugUTM = debugUTM;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
