
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

// Define global initMap function for Google Maps
window.initMap = () => {
  console.log("Google Maps API loaded");
};

// Error handling for React
const renderApp = () => {
  try {
    ReactDOM.createRoot(document.getElementById('root')!).render(
      <React.StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </React.StrictMode>,
    );
  } catch (error) {
    console.error('Failed to render application:', error);
    // Display a fallback UI if the app fails to render
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="padding: 20px; text-align: center;">
          <h2>Something went wrong</h2>
          <p>The application encountered an error. Please refresh the page or contact support.</p>
        </div>
      `;
    }
  }
};

renderApp();
