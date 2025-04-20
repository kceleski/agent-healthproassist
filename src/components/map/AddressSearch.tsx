import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface AddressSearchProps {
  onLocationSelect: (location: { lat: number; lng: number }) => void;
}

export const AddressSearch: React.FC<AddressSearchProps> = ({ onLocationSelect }) => {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!address) return;
    
    setLoading(true);
    
    try {
      // In a real implementation, you would use the Google Maps Geocoding API
      // For demo purposes, we'll simulate it with a timeout and random coordinates
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate geocoding result
      const lat = 33.4484 + (Math.random() - 0.5) * 0.1;
      const lng = -112.0740 + (Math.random() - 0.5) * 0.1;
      
      onLocationSelect({ lat, lng });
    } catch (error) {
      console.error('Geocoding error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex space-x-2">
      <div className="relative flex-grow">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by address..."
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-healthcare-600 focus:border-transparent"
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
      </div>
      <button 
        onClick={handleSearch} 
        disabled={loading}
        className="px-4 py-2 bg-healthcare-600 text-white rounded-md hover:bg-healthcare-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Searching...' : 'Search'}
      </button>
    </div>
  );
};