
import React from 'react';
import ReactDOM from 'react-dom/client';
import CardStack from './components/facilities/CardStack';
import './index.css'; // This will include your Tailwind styles

// Mock data for the embed
const mockFacilities = [
  {
    id: '1',
    name: 'Sunrise Senior Living',
    address: '123 Main St, Phoenix, AZ',
    type: 'Assisted Living',
    rating: 4.5,
    amenities: ['Dining', 'Activities', 'Transportation'],
    phone: '(555) 123-4567',
    website: 'https://example.com'
  },
  {
    id: '2',
    name: 'Golden Years Care',
    address: '456 Oak Ave, Scottsdale, AZ',
    type: 'Memory Care',
    rating: 4.2,
    amenities: ['Medical Care', 'Garden', 'Pet Friendly'],
    phone: '(555) 987-6543',
    website: 'https://example.com'
  }
];

// This code finds a div with the id 'healthproassist-card-stack' on your Squarespace page
// and injects the React component into it.
const container = document.getElementById('healthproassist-card-stack');
if (container) {
  ReactDOM.createRoot(container).render(
    <React.StrictMode>
      <CardStack cards={mockFacilities} onRemoveCard={(id) => console.log('Remove card:', id)} />
    </React.StrictMode>,
  );
} else {
  console.error("Embedding container 'healthproassist-card-stack' not found.");
}
