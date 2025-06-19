import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Search, Filter, MapPin } from 'lucide-react';
import FacilityCard, { Facility } from '@/components/facilities/FacilityCard';
import FacilityModal from '@/components/facilities/FacilityModal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const DirectoryPage = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchFacilities = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('agent_facilities').select('*');
      
      if (error) {
        console.error('Error fetching facilities:', error);
      } else {
        setFacilities(data as Facility[]);
      }
      setLoading(false);
    };
    fetchFacilities();
  }, []);

  const handleViewDetails = (facility: Facility) => {
    setSelectedFacility(facility);
    setIsModalOpen(true);
  };

  const filteredFacilities = facilities.filter(facility =>
    facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (facility.city && facility.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (facility.type && facility.type.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Quality Care Providers</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Search our network of verified healthcare facilities.
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search by name, city, or care type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 text-lg"
              />
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Showing results in Arizona</span>
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Available Facilities</h2>
            <p className="text-gray-600">
              {filteredFacilities.length} {filteredFacilities.length === 1 ? 'facility' : 'facilities'} found
            </p>
          </div>
          {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-96 w-full" />)}
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFacilities.map((facility) => (
                <FacilityCard
                  key={facility.id}
                  facility={facility}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <FacilityModal
        facility={selectedFacility}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default DirectoryPage;
