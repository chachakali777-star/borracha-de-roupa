import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { initUTMTracking } from './utils/utm';

initUTMTracking();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
