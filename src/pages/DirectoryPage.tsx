// src/pages/DirectoryPage.tsx
import React from 'react';
import CardStack from '@/components/facilities/CardStack'; // Import the new component
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const DirectoryPage = () => {
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
            <CardStack />
        </div>
      </section>
    </div>
  );
};

export default DirectoryPage;
