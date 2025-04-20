import React, { useRef, useEffect, useState } from 'react';
import { Location } from '../../types/location';
import { FuturisticLocationCard } from './FuturisticLocationCard';
import { RoleBasedMapFilters } from './RoleBasedMapFilters';
import { AddressSearch } from './AddressSearch';
import { futuristicMapStyle } from '../../lib/mapStyles';
import { createCustomMarkerIcon } from './CustomMarker';
import { 
  Sparkles, 
  List, 
  MapPin, 
  FileText, 
  Calendar, 
  Phone, 
  Heart,
  AlertCircle,
  CheckCircle2,
  X,
  Send
} from 'lucide-react';

interface WorkflowMapContainerProps {
  locations: Location[];
  initialCenter?: { lat: number; lng: number };
  initialZoom?: number;
  clientData?: any; // Optional client data for pre-filling filters
  referralId?: string; // Optional referral ID if coming from a referral workflow
  onReferralAction?: (action: string, locationId: string, data?: any) => Promise<void>;
  userRole?: 'provider' | 'specialist' | 'patient' | 'facility';
}

export const WorkflowMapContainer: React.FC<WorkflowMapContainerProps> = ({
  locations,
  initialCenter = { lat: 39.8283, lng: -98.5795 }, // Center of US
  initialZoom = 4,
  clientData,
  referralId,
  onReferralAction,
  userRole = 'patient'
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [filteredLocations, setFilteredLocations] = useState<Location[]>(locations);
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [isReferralDialogOpen, setIsReferralDialogOpen] = useState(false);
  const [referralType, setReferralType] = useState<'tour' | 'refer' | 'contact'>('refer');
  const [referralNotes, setReferralNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState<Location[]>([]);
  const [showAiRecommendations, setShowAiRecommendations] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Initialize Google Maps
  useEffect(() => {
    // In a real implementation, you would use the Google Maps JavaScript API
    // For demo purposes, we'll create a mock map
    if (mapRef.current && !map) {
      // Create a mock map div
      const mockMap = document.createElement('div');
      mockMap.className = 'h-full w-full flex items-center justify-center bg-gray-100';
      mockMap.innerHTML = '<div class="text-center p-4"><p class="text-lg font-medium mb-2">Interactive Map</p><p class="text-sm text-gray-500">Google Maps would be displayed here in production</p></div>';
      
      // Clear the map container and append the mock map
      while (mapRef.current.firstChild) {
        mapRef.current.removeChild(mapRef.current.firstChild);
      }
      mapRef.current.appendChild(mockMap);
      
      setMapLoaded(true);
    }
  }, []);

  // Update markers when locations or filters change
  useEffect(() => {
    // In a real implementation, this would update the Google Maps markers
    // For demo purposes, we'll just update the filtered locations
    setFilteredLocations(locations);
  }, [locations]);

  // Handle filter changes
  const handleFilterChange = (filters: any) => {
    let filtered = [...locations];
    
    // Apply filters
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(location => 
        location.name.toLowerCase().includes(term) ||
        location.address.toLowerCase().includes(term) ||
        location.city.toLowerCase().includes(term) ||
        location.state.toLowerCase().includes(term) ||
        location.zipCode?.toLowerCase().includes(term)
      );
    }
    
    if (filters.facilityType && filters.facilityType.length > 0) {
      filtered = filtered.filter(location => 
        location.facilityType.some(type => filters.facilityType.includes(type))
      );
    }
    
    if (filters.careLevel && filters.careLevel.length > 0) {
      filtered = filtered.filter(location => 
        location.careLevel.some(level => filters.careLevel.includes(level))
      );
    }
    
    if (filters.priceRange) {
      filtered = filtered.filter(location => location.priceRange === filters.priceRange);
    }
    
    if (filters.availability) {
      filtered = filtered.filter(location => location.availability);
    }
    
    if (filters.rating && filters.rating > 0) {
      filtered = filtered.filter(location => location.rating >= filters.rating);
    }
    
    if (filters.insurance && filters.insurance.length > 0) {
      filtered = filtered.filter(location => 
        location.insurance && location.insurance.some(ins => filters.insurance.includes(ins))
      );
    }
    
    if (filters.medicalNeeds && filters.medicalNeeds.length > 0) {
      filtered = filtered.filter(location => 
        location.medicalNeeds && location.medicalNeeds.some(need => filters.medicalNeeds.includes(need))
      );
    }
    
    if (filters.amenities && filters.amenities.length > 0) {
      filtered = filtered.filter(location => 
        location.amenities && location.amenities.some(amenity => filters.amenities.includes(amenity))
      );
    }
    
    setFilteredLocations(filtered);
  };

  // Handle location selection from address search
  const handleLocationSelect = (location: { lat: number; lng: number }) => {
    // In a real implementation, this would center the map on the selected location
    console.log('Selected location:', location);
  };

  // Handle referral actions
  const handleReferralAction = (action: 'refer' | 'tour' | 'save' | 'contact', locationId: string) => {
    const location = locations.find(loc => loc.id === locationId);
    if (!location) return;
    
    setSelectedLocation(location);
    
    switch (action) {
      case 'refer':
        setReferralType('refer');
        setIsReferralDialogOpen(true);
        break;
        
      case 'tour':
        setReferralType('tour');
        setIsReferralDialogOpen(true);
        break;
        
      case 'contact':
        setReferralType('contact');
        setIsReferralDialogOpen(true);
        break;
        
      case 'save':
        // Handle saving facility to favorites
        console.log('Saving facility to favorites:', location.name);
        break;
    }
  };

  // Submit referral
  const handleSubmitReferral = async () => {
    if (!selectedLocation) return;
    
    setIsSubmitting(true);
    
    try {
      if (onReferralAction) {
        await onReferralAction(referralType, selectedLocation.id, {
          notes: referralNotes,
          referralId,
          clientData
        });
      }
      
      setIsReferralDialogOpen(false);
      setReferralNotes('');
      
      console.log(`${referralType} request submitted for ${selectedLocation.name}`);
    } catch (error) {
      console.error('Error submitting referral:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get AI recommendations
  const getAiRecommendations = () => {
    // This would be an API call in a real implementation
    // For demo purposes, we'll just simulate it
    setShowAiRecommendations(true);
    setIsAiLoading(true);
    
    // Simulate AI processing
    setTimeout(() => {
      // Sort locations by a simulated match score
      const recommendations = locations.slice(0, 5).map(location => ({
        ...location,
        matchScore: Math.floor(Math.random() * 30) + 70, // 70-99% match
        matchReasons: [
          'Location matches client preference',
          'Care services align with client needs',
          'Price range within client budget',
          'Amenities match client preferences'
        ].sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 1)
      }));
      
      setAiRecommendations(recommendations);
      setIsAiLoading(false);
    }, 1500);
  };

  // Render referral dialog content based on type
  const renderReferralDialogContent = () => {
    switch (referralType) {
      case 'refer':
        return (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-auto">
              <div className="p-4 border-b">
                <h2 className="text-lg font-medium">Create Referral</h2>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex items-center space-x-2 p-3 bg-gray-100 rounded-md">
                  <FileText className="h-5 w-5 text-healthcare-600" />
                  <div>
                    <p className="font-medium">{selectedLocation?.name}</p>
                    <p className="text-sm text-gray-500">{selectedLocation?.address}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Referral Notes</label>
                  <textarea
                    className="w-full h-32 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-healthcare-600 focus:border-transparent"
                    placeholder="Add any additional information or special requirements for this referral..."
                    value={referralNotes}
                    onChange={(e) => setReferralNotes(e.target.value)}
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <button 
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
                    onClick={() => setIsReferralDialogOpen(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    className="px-4 py-2 bg-healthcare-600 text-white rounded-md hover:bg-healthcare-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleSubmitReferral}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Send Referral'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'tour':
        return (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-auto">
              <div className="p-4 border-b">
                <h2 className="text-lg font-medium">Schedule Tour</h2>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex items-center space-x-2 p-3 bg-gray-100 rounded-md">
                  <Calendar className="h-5 w-5 text-healthcare-600" />
                  <div>
                    <p className="font-medium">{selectedLocation?.name}</p>
                    <p className="text-sm text-gray-500">{selectedLocation?.address}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Preferred Date & Time</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-healthcare-600 focus:border-transparent"
                      min={new Date().toISOString().split('T')[0]}
                    />
                    <select className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-healthcare-600 focus:border-transparent">
                      <option value="">Select Time</option>
                      <option value="morning">Morning (9am-12pm)</option>
                      <option value="afternoon">Afternoon (12pm-5pm)</option>
                      <option value="evening">Evening (After 5pm)</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Additional Notes</label>
                  <textarea
                    className="w-full h-24 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-healthcare-600 focus:border-transparent"
                    placeholder="Any special requirements or questions for the tour..."
                    value={referralNotes}
                    onChange={(e) => setReferralNotes(e.target.value)}
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <button 
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
                    onClick={() => setIsReferralDialogOpen(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    className="px-4 py-2 bg-healthcare-600 text-white rounded-md hover:bg-healthcare-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleSubmitReferral}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Scheduling...' : 'Schedule Tour'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'contact':
        return (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-auto">
              <div className="p-4 border-b">
                <h2 className="text-lg font-medium">Contact Facility</h2>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex items-center space-x-2 p-3 bg-gray-100 rounded-md">
                  <Phone className="h-5 w-5 text-healthcare-600" />
                  <div>
                    <p className="font-medium">{selectedLocation?.name}</p>
                    <p className="text-sm text-gray-500">{selectedLocation?.address}</p>
                    {selectedLocation?.phone && (
                      <p className="text-sm font-medium mt-1">{selectedLocation.phone}</p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Contact Method</label>
                  <div className="flex space-x-2">
                    <button className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">
                      <Phone className="h-4 w-4 mr-2 inline-block" />
                      Call Now
                    </button>
                    <button className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">
                      <FileText className="h-4 w-4 mr-2 inline-block" />
                      Email
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Message</label>
                  <textarea
                    className="w-full h-32 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-healthcare-600 focus:border-transparent"
                    placeholder="Your message to the facility..."
                    value={referralNotes}
                    onChange={(e) => setReferralNotes(e.target.value)}
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <button 
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
                    onClick={() => setIsReferralDialogOpen(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    className="px-4 py-2 bg-healthcare-600 text-white rounded-md hover:bg-healthcare-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleSubmitReferral}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
        <h2 className="text-2xl font-bold">Facility Locations</h2>
        
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <AddressSearch onLocationSelect={handleLocationSelect} />
          
          <div className="flex space-x-2">
            <button 
              className={`flex-1 md:flex-none px-4 py-2 ${
                viewMode === 'map' 
                  ? 'bg-healthcare-600 text-white' 
                  : 'bg-white border border-gray-300 text-gray-700'
              } rounded-md text-sm font-medium transition-colors`}
              onClick={() => setViewMode('map')}
            >
              <MapPin className="h-4 w-4 mr-2 inline-block" />
              Map
            </button>
            <button 
              className={`flex-1 md:flex-none px-4 py-2 ${
                viewMode === 'list' 
                  ? 'bg-healthcare-600 text-white' 
                  : 'bg-white border border-gray-300 text-gray-700'
              } rounded-md text-sm font-medium transition-colors`}
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4 mr-2 inline-block" />
              List
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row h-full gap-4">
        {/* Filters Panel */}
        <div className="w-full md:w-80 flex-shrink-0 mb-4 md:mb-0">
          <RoleBasedMapFilters 
            onFilterChange={handleFilterChange} 
            userRole={userRole} 
            clientData={clientData}
          />
          
          {/* Location count */}
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <p className="text-sm">
              Showing <span className="font-medium">{filteredLocations.length}</span> of <span className="font-medium">{locations.length}</span> facilities
            </p>
          </div>
          
          {/* AI Recommendation Button */}
          {(userRole === 'provider' || userRole === 'specialist') && clientData && (
            <button 
              className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
              onClick={getAiRecommendations}
            >
              <Sparkles className="h-4 w-4 mr-2 inline-block" />
              Get AI Recommendations
            </button>
          )}
        </div>
        
        {/* Map or List View */}
        <div className="flex-grow">
          {showAiRecommendations ? (
            <div className="h-full overflow-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium flex items-center">
                  <Sparkles className="h-4 w-4 mr-2 text-healthcare-600" />
                  AI Recommended Facilities
                </h3>
                <button 
                  className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                  onClick={() => setShowAiRecommendations(false)}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {isAiLoading ? (
                  <div className="col-span-full flex items-center justify-center h-64">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-healthcare-600 mx-auto mb-4"></div>
                      <p className="text-gray-500">Analyzing client data and finding the best matches...</p>
                    </div>
                  </div>
                ) : aiRecommendations.length > 0 ? (
                  aiRecommendations.map(location => (
                    <FuturisticLocationCard 
                      key={location.id} 
                      location={location} 
                      onClick={() => setSelectedLocation(location)}
                      isSelected={selectedLocation?.id === location.id}
                      userRole={userRole}
                      onReferralAction={handleReferralAction}
                      matchScore={location.matchScore}
                      matchReasons={location.matchReasons}
                    />
                  ))
                ) : (
                  <div className="col-span-full flex items-center justify-center h-64">
                    <div className="text-center">
                      <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No recommendations available</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : viewMode === 'map' ? (
            <div className="h-full rounded-lg overflow-hidden border border-gray-200">
              <div ref={mapRef} className="h-full w-full"></div>
            </div>
          ) : (
            <div className="h-full overflow-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredLocations.map(location => (
                  <FuturisticLocationCard 
                    key={location.id} 
                    location={location} 
                    onClick={() => setSelectedLocation(location)}
                    isSelected={selectedLocation?.id === location.id}
                    userRole={userRole}
                    onReferralAction={handleReferralAction}
                  />
                ))}
                
                {filteredLocations.length === 0 && (
                  <div className="col-span-full flex items-center justify-center h-64">
                    <div className="text-center">
                      <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No facilities match your filters</p>
                      <button 
                        className="mt-4 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
                        onClick={() => handleFilterChange({})}
                      >
                        Reset Filters
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Referral Dialog */}
      {isReferralDialogOpen && renderReferralDialogContent()}
    </div>
  );
};