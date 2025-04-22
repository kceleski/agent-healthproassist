
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Clear any existing errors
console.clear();

// Add error handling for unhandled exceptions
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
});

createRoot(document.getElementById("root")!).render(<App />);
