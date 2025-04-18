
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

// Define global initMap function for Google Maps
window.initMap = () => {
  console.log("Google Maps API loaded");
};

// Error boundary for React rendering
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('React error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>Something went wrong</h2>
          <p>The application encountered an error. Please refresh the page or contact support.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

// Enhanced error handling for rendering
const renderApp = () => {
  try {
    ReactDOM.createRoot(document.getElementById('root')!).render(
      <ErrorBoundary>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ErrorBoundary>,
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
