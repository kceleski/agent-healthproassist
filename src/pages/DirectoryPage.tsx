
// src/pages/DirectoryPage.tsx
import React, { useState } from 'react';
import CardStack from '@/components/facilities/CardStack'; // Import the new component
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

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
  },
  {
    id: '3',
    name: 'Peaceful Gardens',
    address: '789 Pine Rd, Tempe, AZ',
    type: 'Independent Living',
    rating: 4.8,
    amenities: ['Pool', 'Fitness Center', 'Library'],
    phone: '(555) 456-7890',
    website: 'https://example.com'
  }
];

const DirectoryPage = () => {
  const [facilities, setFacilities] = useState(mockFacilities);

  const handleRemoveCard = (id: string) => {
    setFacilities(prev => prev.filter(facility => facility.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">Discover Your Ideal Care</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              An interactive way to explore trusted care options. Swipe through facilities to find the perfect fit for you or your loved ones.
            </p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* The CardStack component is now the centerpiece */}
            <CardStack cards={facilities} onRemoveCard={handleRemoveCard} />
        </div>
      </section>
    </div>
  );
};

export default DirectoryPage;
