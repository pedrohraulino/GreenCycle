
import './index.css'
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { MapProvider } from '../Components/contexto';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MapProvider>
      <App />
    </MapProvider>
  </React.StrictMode>
);

