
import { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { apiRequest } from '@/lib/queryClient';
import { Loader2, MapPin, Phone, Globe, Star, Check } from 'lucide-react';

interface Facility {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
  website: string;
  careTypes: string[];
  paymentMethods: string[];
  amenities: string[];
  rating: number;
  costRange: string;
  description: string;
  imageUrl: string;
}

interface FacilityDetailsModalProps {
  facilityId: number | null;
  onClose: () => void;
  fetchAdditionalInfo?: (facility: Facility) => Promise<{
    description?: string;
    amenities?: string[];
    paymentOptions?: string[];
    additionalInfo?: string;
    source?: string;
  }>;
}

export function FacilityDetailsModal({ 
  facilityId, 
  onClose,
  fetchAdditionalInfo
}: FacilityDetailsModalProps) {
  const [facility, setFacility] = useState<Facility | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [additionalInfo, setAdditionalInfo] = useState<{
    description?: string;
    amenities?: string[];
    paymentOptions?: string[];
    additionalInfo?: string;
    source?: string;
    isLoading: boolean;
  }>({
    amenities: [],
    paymentOptions: [],
    isLoading: false
  });

  // Fetch facility details when ID changes
  useEffect(() => {
    async function fetchFacilityDetails() {
      if (!facilityId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await apiRequest("GET", `/api/facilities/${facilityId}`);
        const data = await response.json();
        setFacility(data);
        
        // After getting basic facility data, fetch additional details
        if (data && fetchAdditionalInfo) {
          setAdditionalInfo(prev => ({ ...prev, isLoading: true }));
          
          const additionalDetails = await fetchAdditionalInfo(data);
          
          setAdditionalInfo({
            ...additionalDetails,
            isLoading: false
          });
        }
      } catch (error) {
        console.error("Error fetching facility details:", error);
        setError("There was an error loading the facility details.");
      } finally {
        setLoading(false);
      }
    }
    
    fetchFacilityDetails();
  }, [facilityId, fetchAdditionalInfo]);

  // Format care type for display
  const formatCareType = (type: string) => {
    return type
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <Dialog open={!!facilityId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-10">
            <Loader2 className="h-10 w-10 animate-spin text-hpa-patriotic-blue mb-4" />
            <p className="text-hpa-neutral-600">Loading facility details...</p>
          </div>
        ) : error ? (
          <div className="text-center p-10">
            <p className="text-red-500 mb-4">{error}</p>
            <Button 
              onClick={onClose}
              variant="outline"
            >
              Close
            </Button>
          </div>
        ) : facility ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-hpa-blue-900">
                {facility.name}
              </DialogTitle>
              <div className="flex items-center text-sm text-hpa-neutral-600 mt-2">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{facility.address}, {facility.city}, {facility.state} {facility.zipCode}</span>
              </div>
            </DialogHeader>
            
            <div className="mt-4">
              <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-4 mb-4">
                  <TabsTrigger 
                    value="overview"
                    className="data-[state=active]:bg-hpa-patriotic-blue data-[state=active]:text-white"
                  >
                    Overview
                  </TabsTrigger>
                  <TabsTrigger 
                    value="amenities"
                    className="data-[state=active]:bg-hpa-patriotic-blue data-[state=active]:text-white"
                  >
                    Amenities
                  </TabsTrigger>
                  <TabsTrigger 
                    value="costs"
                    className="data-[state=active]:bg-hpa-patriotic-blue data-[state=active]:text-white"
                  >
                    Costs & Payment
                  </TabsTrigger>
                  <TabsTrigger 
                    value="photos"
                    className="data-[state=active]:bg-hpa-patriotic-blue data-[state=active]:text-white"
                  >
                    Photos
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="p-1">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-2/3">
                      <div className="aspect-video overflow-hidden rounded-md mb-4">
                        <img 
                          src={facility.imageUrl || '/placeholder-facility.jpg'} 
                          alt={facility.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <h3 className="text-lg font-semibold text-hpa-blue-900 mb-2">About {facility.name}</h3>
                      <p className="text-hpa-neutral-600 mb-4">
                        {additionalInfo.description || facility.description || "No description available."}
                      </p>
                      
                      {additionalInfo.additionalInfo && (
                        <div className="mt-4">
                          <h3 className="text-lg font-semibold text-hpa-blue-900 mb-2">Additional Information</h3>
                          <p className="text-hpa-neutral-600">{additionalInfo.additionalInfo}</p>
                        </div>
                      )}
                      
                      {additionalInfo.source && (
                        <div className="mt-6 text-xs text-hpa-neutral-500">
                          <p>Source: <a href={additionalInfo.source} target="_blank" rel="noopener noreferrer" className="text-hpa-patriotic-blue hover:underline">{additionalInfo.source}</a></p>
                        </div>
                      )}
                    </div>
                    
                    <div className="md:w-1/3">
                      <div className="bg-gray-50 p-4 rounded-md mb-4">
                        <h3 className="text-lg font-semibold text-hpa-blue-900 mb-3">Contact Information</h3>
                        
                        <div className="flex items-center mb-2">
                          <Phone className="h-4 w-4 mr-2 text-hpa-patriotic-blue" />
                          <a href={`tel:${facility.phoneNumber}`} className="text-hpa-blue-900 hover:text-hpa-patriotic-blue">
                            {facility.phoneNumber}
                          </a>
                        </div>
                        
                        {facility.website && (
                          <div className="flex items-center">
                            <Globe className="h-4 w-4 mr-2 text-hpa-patriotic-blue" />
                            <a 
                              href={facility.website.startsWith('http') ? facility.website : `https://${facility.website}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-hpa-blue-900 hover:text-hpa-patriotic-blue break-all"
                            >
                              {facility.website}
                            </a>
                          </div>
                        )}
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-md mb-4">
                        <h3 className="text-lg font-semibold text-hpa-blue-900 mb-3">Care Types</h3>
                        <ul className="space-y-2">
                          {facility.careTypes.map((type, index) => (
                            <li key={index} className="flex items-center">
                              <Check className="h-4 w-4 mr-2 text-green-500" />
                              <span>{formatCareType(type)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-md">
                        <h3 className="text-lg font-semibold text-hpa-blue-900 mb-2">Rating</h3>
                        <div className="flex items-center">
                          <div className="flex mr-2">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-5 h-5 ${i < facility.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                          <span className="text-hpa-neutral-600">{facility.rating.toFixed(1)} out of 5</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="amenities" className="p-1">
                  {additionalInfo.isLoading ? (
                    <div className="flex flex-col items-center justify-center p-10">
                      <Loader2 className="h-6 w-6 animate-spin text-hpa-patriotic-blue mb-2" />
                      <p className="text-sm text-hpa-neutral-600">Loading amenities information...</p>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-lg font-semibold text-hpa-blue-900 mb-4">Amenities & Services</h3>
                      
                      {additionalInfo.amenities && additionalInfo.amenities.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {additionalInfo.amenities.map((amenity, index) => (
                            <div key={index} className="flex items-start">
                              <Check className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                              <span className="text-hpa-neutral-700">{amenity}</span>
                            </div>
                          ))}
                        </div>
                      ) : facility.amenities && facility.amenities.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {facility.amenities.map((amenity, index) => (
                            <div key={index} className="flex items-start">
                              <Check className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                              <span className="text-hpa-neutral-700">{amenity}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-hpa-neutral-600">Detailed amenity information is not available. Please contact the facility for more details.</p>
                      )}
                      
                      {additionalInfo.source && (
                        <div className="mt-6 text-xs text-hpa-neutral-500">
                          <p>Source: <a href={additionalInfo.source} target="_blank" rel="noopener noreferrer" className="text-hpa-patriotic-blue hover:underline">{additionalInfo.source}</a></p>
                        </div>
                      )}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="costs" className="p-1">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-hpa-blue-900 mb-3">Cost Range</h3>
                      <p className="text-xl font-bold text-hpa-blue-900 mb-2">{facility.costRange}</p>
                      <p className="text-sm text-hpa-neutral-600">
                        Actual costs may vary based on care needs, room type, and additional services. 
                        Contact the facility for personalized pricing information.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-hpa-blue-900 mb-3">Payment Options</h3>
                      
                      {additionalInfo.isLoading ? (
                        <div className="flex items-center my-4">
                          <Loader2 className="h-5 w-5 animate-spin text-hpa-patriotic-blue mr-2" />
                          <span className="text-sm text-hpa-neutral-600">Loading payment information...</span>
                        </div>
                      ) : additionalInfo.paymentOptions && additionalInfo.paymentOptions.length > 0 ? (
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {additionalInfo.paymentOptions.map((option, index) => (
                            <li key={index} className="flex items-center">
                              <Check className="h-5 w-5 mr-2 text-green-500" />
                              <span className="text-hpa-neutral-700">{option}</span>
                            </li>
                          ))}
                        </ul>
                      ) : facility.paymentMethods && facility.paymentMethods.length > 0 ? (
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {facility.paymentMethods.map((method, index) => (
                            <li key={index} className="flex items-center">
                              <Check className="h-5 w-5 mr-2 text-green-500" />
                              <span className="text-hpa-neutral-700">
                                {method.replace(/_/g, ' ').split(' ').map(word => 
                                  word.charAt(0).toUpperCase() + word.slice(1)
                                ).join(' ')}
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-hpa-neutral-600">Detailed payment information is not available. Please contact the facility directly for more details.</p>
                      )}
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-md">
                      <h3 className="text-md font-semibold text-hpa-blue-900 mb-2">Get Financial Assistance</h3>
                      <p className="text-sm text-hpa-neutral-700 mb-3">
                        Our care advisors can help you navigate payment options, including:
                      </p>
                      <ul className="text-sm space-y-1 text-hpa-neutral-700 mb-3">
                        <li className="flex items-start">
                          <Check className="h-4 w-4 mr-2 text-green-500 shrink-0 mt-0.5" />
                          Veterans benefits and Aid & Attendance
                        </li>
                        <li className="flex items-start">
                          <Check className="h-4 w-4 mr-2 text-green-500 shrink-0 mt-0.5" />
                          Long-term care insurance claims
                        </li>
                        <li className="flex items-start">
                          <Check className="h-4 w-4 mr-2 text-green-500 shrink-0 mt-0.5" />
                          Medicaid eligibility and application
                        </li>
                      </ul>
                      <Button
                        className="w-full bg-hpa-patriotic-blue hover:bg-hpa-patriotic-blue/90 text-white"
                        onClick={() => {
                          // Implement contact advisor functionality
                          console.log("Contact advisor for financial assistance");
                        }}
                      >
                        Speak with a Financial Advisor
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="photos" className="p-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* This would normally fetch and display actual facility photos */}
                    <div className="aspect-square overflow-hidden rounded-md">
                      <img 
                        src={facility.imageUrl || '/placeholder-facility.jpg'} 
                        alt={`${facility.name} - Main View`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="aspect-square overflow-hidden rounded-md">
                      <img 
                        src="/placeholder-interior.jpg" 
                        alt={`${facility.name} - Interior`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="aspect-square overflow-hidden rounded-md">
                      <img 
                        src="/placeholder-dining.jpg" 
                        alt={`${facility.name} - Dining Area`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="aspect-square overflow-hidden rounded-md">
                      <img 
                        src="/placeholder-activities.jpg" 
                        alt={`${facility.name} - Activities`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <p className="text-sm text-hpa-neutral-600 mt-4">
                    Contact the facility to schedule an in-person tour to see all available amenities and living spaces.
                  </p>
                </TabsContent>
              </Tabs>
            </div>
            
            <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-6">
              <Button 
                variant="outline" 
                onClick={onClose}
                className="sm:order-1"
              >
                Close
              </Button>
              <Button
                className="bg-hpa-patriotic-blue hover:bg-hpa-patriotic-blue/90 text-white sm:order-2"
                onClick={() => {
                  // Implement contact/schedule tour functionality
                  console.log("Contact facility or schedule tour");
                }}
              >
                Schedule a Tour
              </Button>
              <Button
                variant="secondary"
                className="sm:order-3"
                onClick={() => {
                  // Implement save/favorite functionality
                  console.log("Save facility to favorites");
                }}
              >
                Save to Favorites
              </Button>
            </DialogFooter>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
