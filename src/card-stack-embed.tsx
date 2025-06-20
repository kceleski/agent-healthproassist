import React from 'react';
import ReactDOM from 'react-dom/client';
import CardStack from './components/facilities/CardStack';
import './index.css'; // This will include your Tailwind styles

// This code finds a div with the id 'healthproassist-card-stack' on your Squarespace page
// and injects the React component into it.
const container = document.getElementById('healthproassist-card-stack');
if (container) {
  ReactDOM.createRoot(container).render(
    <React.StrictMode>
      <CardStack />
    </React.StrictMode>,
  );
} else {
  console.error("Embedding container 'healthproassist-card-stack' not found.");
}
