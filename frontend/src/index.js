import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { initUTMTracking, debugUTM } from './utils/utm';
import { initMetaPixel } from './utils/metaPixel';

// Inicializar tracking UTM
initUTMTracking();

// Inicializar Meta Pixel
initMetaPixel();

// Disponibilizar função de debug globalmente para testes
window.debugUTM = debugUTM;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
