import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AvatarCircle } from '@/components/ui/avatar-circle';
import { Loader2, Building, Brain, Home, Bed, Heart, Activity, Users, Book, MapPin } from 'lucide-react';
import { apiRequest } from "@/lib/queryClient";
import { FacilityDetailsModal } from "@/components/ui/facility-details-modal";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  relationshipToReceiver: string;
  receiverName: string;
  receiverAge: string;
  receiverLocation: string;
  receiverNeeds: string[];
  mobilityLevel: string;
  cognitiveStatus: string;
  medicalConditions: string;
  livingPreference: string;
  budgetRange: string;
  urgency: string;
  additionalInfo: string;
}

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

interface CareType {
  id: string;
  title: string;
  icon: React.ReactNode;
  shortDescription: string;
  description: string;
  keyFeatures: string[];
  idealFor: string[];
  costRange: string;
  paymentOptions: string[];
}

interface FormState {
  step: number;
  isSubmitting: boolean;
  isLoading: boolean;
  hasResults: boolean;
  error: string | null;
  facilities: Facility[];
}

export type UserRole = "self" | "family" | "provider";
export type CareTypeValue = "assisted_living" | "memory_care" | "nursing_home" | "independent_living" | "home_care" | "unsure";
export type PaymentMethod = "private_pay" | "medicaid" | "veterans" | "insurance" | "unsure";
export type Preference = "pet_friendly" | "social" | "outdoor" | "dietary" | "wellness";

interface EmbeddableCareFormProps {
  embedded?: boolean;
  initialParams?: {
    role?: UserRole;
    location?: string;
    careType?: CareTypeValue;
    payment?: PaymentMethod;
    preferences?: Preference[];
  };
  careTypes?: CareType[];
}

const initialFormData: FormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  relationshipToReceiver: '',
  receiverName: '',
  receiverAge: '',
  receiverLocation: '',
  receiverNeeds: [],
  mobilityLevel: '',
  cognitiveStatus: '',
  medicalConditions: '',
  livingPreference: '',
  budgetRange: '',
  urgency: '',
  additionalInfo: ''
};

const defaultCareTypes: CareType[] = [
  {
    id: 'assisted-living',
    title: 'Assisted Living',
    icon: <Building className="h-8 w-8 text-hpa-patriotic-blue" />,
    shortDescription: 'Support with daily activities while maintaining independence in a community setting.',
    description: 'Assisted living communities provide personalized care in a residential setting for seniors who need some help with daily activities but don\'t require intensive medical care.',
    keyFeatures: [
      '24/7 staff availability',
      'Medication management',
      'Nutritious meals and dining services'
    ],
    idealFor: [
      'Seniors who need some assistance with daily activities',
      'Those who want to maintain independence but benefit from having help available'
    ],
    costRange: '$3,000 - $6,000 per month',
    paymentOptions: [
      'Private pay',
      'Long-term care insurance',
      'Veterans benefits'
    ]
  },
  {
    id: 'memory-care',
    title: 'Memory Care',
    icon: <Brain className="h-8 w-8 text-hpa-patriotic-blue" />,
    shortDescription: 'Specialized support for Alzheimer\'s, dementia, and other memory-related conditions.',
    description: 'Memory care facilities provide specialized care for seniors with Alzheimer\'s disease, dementia, and other memory impairments.',
    keyFeatures: [
      'Secure, monitored environment',
      'Staff specially trained in dementia care',
      'Memory-enhancing therapies and activities'
    ],
    idealFor: [
      'Individuals diagnosed with Alzheimer\'s disease or other forms of dementia',
      'Seniors experiencing significant cognitive decline'
    ],
    costRange: '$5,000 - $8,000+ per month',
    paymentOptions: [
      'Private pay',
      'Long-term care insurance',
      'Veterans benefits'
    ]
  }
];

export const EmbeddableCareForm = ({ 
  embedded = false, 
  initialParams = {}, 
  careTypes = defaultCareTypes 
}: EmbeddableCareFormProps) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [formState, setFormState] = useState<FormState>({
    step: 1,
    isSubmitting: false,
    isLoading: false,
    hasResults: false,
    error: null,
    facilities: []
  });
  const [selectedFacilityId, setSelectedFacilityId] = useState<number | null>(null);

  useEffect(() => {
    if (Object.keys(initialParams).length > 0) {
      setFormData(prevData => ({
        ...prevData,
        relationshipToReceiver: initialParams.role || prevData.relationshipToReceiver,
        receiverLocation: initialParams.location || prevData.receiverLocation,
        livingPreference: initialParams.careType === 'home_care' 
          ? 'home' 
          : initialParams.careType === 'independent_living' || 
            initialParams.careType === 'assisted_living' || 
            initialParams.careType === 'memory_care' || 
            initialParams.careType === 'nursing_home'
            ? 'community'
            : prevData.livingPreference,
        budgetRange: initialParams.payment === 'private_pay'
          ? '4000-6000'
          : initialParams.payment === 'medicaid'
          ? 'under-2000'
          : prevData.budgetRange
      }));

      if (initialParams.location && initialParams.careType) {
        searchFacilities();
      }
    }
  }, [initialParams]);

  const needsOptions = [
    { value: 'assistance-daily', label: 'Assistance with daily activities' },
    { value: 'medication-management', label: 'Medication management' },
    { value: 'memory-support', label: 'Memory care support' },
    { value: 'mobility-assistance', label: 'Mobility assistance' },
    { value: 'meal-preparation', label: 'Meal preparation' },
    { value: 'transportation', label: 'Transportation services' },
    { value: 'nursing-care', label: 'Skilled nursing care' },
    { value: 'companionship', label: 'Companionship' },
    { value: 'rehabilitation', label: 'Rehabilitation services' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (value) => {
    setFormData(prev => {
      const currentNeeds = [...prev.receiverNeeds];
      
      if (currentNeeds.includes(value)) {
        return { ...prev, receiverNeeds: currentNeeds.filter(need => need !== value) };
      } else {
        return { ...prev, receiverNeeds: [...currentNeeds, value] };
      }
    });
  };

  const mapFormDataToApiParams = useCallback(() => {
    const getCareType = (): CareTypeValue => {
      if (formData.cognitiveStatus === 'moderate' || formData.cognitiveStatus === 'severe') {
        return 'memory_care';
      } 
      
      switch(formData.livingPreference) {
        case 'home':
          return 'home_care';
        case 'community':
          if (formData.mobilityLevel === 'bedridden') return 'nursing_home';
          if (formData.mobilityLevel === 'wheelchair') return 'assisted_living';
          if (formData.mobilityLevel === 'independent') return 'independent_living';
          return 'assisted_living';
        default:
          return 'unsure';
      }
    };
    
    const getPaymentMethod = (): PaymentMethod => {
      if (formData.budgetRange === 'under-2000') {
        return 'medicaid';
      }
      
      return 'private_pay';
    };
    
    const getPreferences = (): Preference[] => {
      const preferences: Preference[] = [];
      
      if (formData.receiverNeeds.includes('companionship')) preferences.push('social');
      if (initialParams.preferences) {
        initialParams.preferences.forEach(pref => {
          if (!preferences.includes(pref)) {
            preferences.push(pref);
          }
        });
      }
      
      return preferences;
    };
    
    return {
      userRole: (formData.relationshipToReceiver === 'self' ? 'self' : 'family') as UserRole,
      location: formData.receiverLocation || initialParams.location || '',
      careType: initialParams.careType || getCareType(),
      paymentMethod: initialParams.payment || getPaymentMethod(),
      preferences: getPreferences(),
      ageRange: formData.receiverAge,
      needsLevel: formData.mobilityLevel === 'bedridden' || formData.cognitiveStatus === 'severe' ? 'high' : 'medium',
      urgency: formData.urgency
    };
  }, [formData, initialParams]);

  const searchFacilities = useCallback(async () => {
    setFormState(prev => ({ 
      ...prev, 
      isSubmitting: true,
      isLoading: true,
      error: null 
    }));
    
    try {
      const apiParams = mapFormDataToApiParams();
      
      const response = await apiRequest("POST", "/api/facilities/search", apiParams);
      
      const data = await response.json();
      
      setFormState(prev => ({ 
        ...prev, 
        facilities: data.facilities,
        hasResults: true,
        isSubmitting: false,
        isLoading: false
      }));
      
    } catch (error) {
      console.error("Error searching facilities:", error);
      setFormState(prev => ({ 
        ...prev,
        isSubmitting: false,
        isLoading: false,
        error: "Sorry, there was an error searching for facilities. Please try again."
      }));
    }
  }, [mapFormDataToApiParams]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.receiverLocation && !initialParams.location) {
      setFormState(prev => ({ 
        ...prev,
        error: "Please provide a location to search for care facilities."
      }));
      return;
    }
    
    searchFacilities();
  };

  const handleFacilitySelect = (facility: Facility) => {
    setSelectedFacilityId(facility.id);
  };

  const handleCloseFacilityModal = () => {
    setSelectedFacilityId(null);
  };

  const getCareTypeIcon = (type: string) => {
    switch(type) {
      case 'assisted_living':
        return <Building className="h-5 w-5 text-hpa-patriotic-blue" />;
      case 'memory_care':
        return <Brain className="h-5 w-5 text-hpa-patriotic-blue" />;
      case 'independent_living':
        return <Home className="h-5 w-5 text-hpa-patriotic-blue" />;
      case 'nursing_home':
        return <Bed className="h-5 w-5 text-hpa-patriotic-blue" />;
      case 'home_care':
        return <Heart className="h-5 w-5 text-hpa-patriotic-blue" />;
      case 'respite_care':
        return <Activity className="h-5 w-5 text-hpa-patriotic-blue" />;
      case 'adult_day_care':
        return <Users className="h-5 w-5 text-hpa-patriotic-blue" />;
      case 'palliative_care':
        return <Book className="h-5 w-5 text-hpa-patriotic-blue" />;
      default:
        return <Building className="h-5 w-5 text-hpa-patriotic-blue" />;
    }
  };

  if (formState.hasResults) {
    return (
      <div className={`${embedded ? "w-full h-full" : "max-w-6xl mx-auto my-8"}`}>
        <div className={`space-y-6 ${embedded ? "p-4" : ""}`}>
          <div className="flex flex-wrap items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-hpa-blue-900">Care Recommendations</h2>
              <p className="text-hpa-neutral-600 mt-1">
                Based on your needs in {formData.receiverLocation || initialParams.location}
              </p>
            </div>
            <Button 
              onClick={() => setFormState(prev => ({ ...prev, hasResults: false }))}
              variant="outline"
              className="mt-2 sm:mt-0"
            >
              Refine Search
            </Button>
          </div>
          
          {formState.isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-hpa-patriotic-blue mb-4" />
              <p className="text-hpa-neutral-600">Searching for the best care options...</p>
            </div>
          ) : formState.facilities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {formState.facilities.map((facility) => (
                <Card key={facility.id} className="overflow-hidden transition-all hover:shadow-md">
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={facility.imageUrl || '/placeholder-facility.jpg'} 
                      alt={facility.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-hpa-blue-900 mb-2">{facility.name}</h3>
                    
                    <div className="flex items-center text-sm text-hpa-neutral-600 mb-3">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{facility.city}, {facility.state}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {facility.careTypes.map((type, index) => (
                        <div 
                          key={index}
                          className="inline-flex items-center px-2 py-1 bg-hpa-blue-100 text-hpa-blue-800 rounded-full text-xs"
                        >
                          {getCareTypeIcon(type)}
                          <span className="ml-1">
                            {type.replace(/_/g, ' ').split(' ').map(word => 
                              word.charAt(0).toUpperCase() + word.slice(1)
                            ).join(' ')}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    <p className="text-hpa-neutral-600 mb-4 line-clamp-2">
                      {facility.description}
                    </p>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-hpa-blue-900 font-semibold">
                        {facility.costRange}
                      </div>
                      <Button 
                        onClick={() => handleFacilitySelect(facility)}
                        className="bg-hpa-patriotic-blue hover:bg-hpa-patriotic-blue/90 text-white"
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-gray-50 rounded-lg">
              <Building className="h-16 w-16 mx-auto text-hpa-neutral-400 mb-4" />
              <h3 className="text-xl font-semibold text-hpa-blue-900 mb-2">No Facilities Found</h3>
              <p className="text-hpa-neutral-600 max-w-md mx-auto mb-6">
                We couldn't find any facilities matching your criteria. Try adjusting your search parameters.
              </p>
              <Button 
                onClick={() => setFormState(prev => ({ ...prev, hasResults: false }))}
                className="bg-hpa-patriotic-blue hover:bg-hpa-patriotic-blue/90 text-white"
              >
                Update Search
              </Button>
            </div>
          )}
        </div>
        
        <FacilityDetailsModal 
          facilityId={selectedFacilityId} 
          onClose={handleCloseFacilityModal}
          fetchAdditionalInfo={async (facility) => {
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            return {
              description: facility.description + " We provide a range of services tailored to each resident's unique needs, with a focus on maintaining independence while offering support when needed.",
              amenities: [
                "24/7 Professional Staff",
                "Chef-prepared Meals",
                "Wellness Programs",
                "Housekeeping Services",
                "Transportation Services",
                "Social Activities",
                "Outdoor Gardens",
                "Beauty Salon",
                "Fitness Center",
                "Library and Computer Room"
              ],
              paymentOptions: [
                "Private Pay",
                "Long-term Care Insurance",
                "Veterans Benefits (Aid & Attendance)",
                "Medicare (for skilled nursing)",
                "Medicaid (limited availability)"
              ],
              additionalInfo: "This facility has received recognition for excellence in senior care and maintains a high staff-to-resident ratio to ensure personalized attention.",
              source: "https://www.seniorlivingdirectory.com"
            };
          }}
        />
      </div>
    );
  }

  return (
    <div className={`${embedded ? "w-full h-full" : "max-w-6xl mx-auto my-8"}`}>
      <div className={`${embedded ? "h-full flex flex-col" : ""}`}>
        {embedded && (
          <div className="bg-gradient-to-r from-blue-900/70 to-blue-800/50 p-2 relative">
            <div className="flex items-center before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-blue-400/50 before:to-transparent">
              <div className="relative">
                <AvatarCircle
                  size="sm"
                  glow={true}
                  pulse={true}
                  image="/ava-headshot.png"
                  alt="AVA AI Assistant"
                  className="futuristic-glow w-6 h-6"
                />
                <span className="absolute -bottom-1 -right-1 w-2 h-2 flex items-center justify-center bg-blue-600 rounded-full border border-blue-900 text-[5px] text-white">AI</span>
              </div>
              <div className="ml-2">
                <h2 className="font-montserrat font-bold text-xs text-white hud-text flex items-center">
                  AVA <span className="ml-1 text-[6px] font-normal text-blue-300 border border-blue-500/30 px-1 py-0.5 rounded">v2.4</span>
                </h2>
                <p className="text-blue-200 font-light text-[6px] tracking-wider uppercase">Adaptive Virtual Assistant</p>
              </div>
            </div>
            
            <div className="absolute top-0 right-0 m-1 flex flex-col items-end">
              <div className="flex items-center space-x-1">
                <div className="hidden sm:block text-[6px] text-blue-300 bg-blue-900/40 border border-blue-800/60 rounded px-1 py-0.5">
                  SYSTEM READY
                </div>
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
              </div>
              <div className="hidden sm:flex text-[5px] text-blue-400 justify-end space-x-1">
                <span>MEM:78%</span>
                <span>CPU:24%</span>
                <span>NET:195ms</span>
              </div>
            </div>
          </div>
        )}
        
        <Card className={`${embedded ? "flex-1 overflow-y-auto border-0 shadow-none rounded-none" : ""}`}>
          <CardContent className={`p-6 ${embedded ? "h-full overflow-y-auto" : ""}`}>
            <form onSubmit={handleSubmit} className={`${embedded ? "h-full" : ""}`}>
              {formState.step === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-hpa-blue-900 mb-4">Your Information</h2>
                    <p className="text-hpa-neutral-600 mb-6">Please provide your contact details so we can follow up with personalized care recommendations.</p>
                  </div>
  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input 
                        id="firstName" 
                        name="firstName" 
                        value={formData.firstName} 
                        onChange={handleInputChange} 
                        required 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input 
                        id="lastName" 
                        name="lastName" 
                        value={formData.lastName} 
                        onChange={handleInputChange} 
                        required 
                      />
                    </div>
                  </div>
  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        name="email" 
                        type="email" 
                        value={formData.email} 
                        onChange={handleInputChange} 
                        required 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone" 
                        name="phone" 
                        type="tel" 
                        value={formData.phone} 
                        onChange={handleInputChange} 
                        required 
                      />
                    </div>
                  </div>
  
                  <div className="space-y-2">
                    <Label htmlFor="relationshipToReceiver">What is your relationship to the person needing care?</Label>
                    <Select
                      value={formData.relationshipToReceiver}
                      onValueChange={(value) => handleSelectChange('relationshipToReceiver', value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select relationship" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="self">Self</SelectItem>
                        <SelectItem value="spouse">Spouse/Partner</SelectItem>
                        <SelectItem value="parent">Parent</SelectItem>
                        <SelectItem value="sibling">Sibling</SelectItem>
                        <SelectItem value="friend">Friend</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
  
                  <div className="flex justify-end mt-6">
                    <Button 
                      type="button" 
                      onClick={() => setFormState(prev => ({ ...prev, step: 2 }))}
                      className="bg-hpa-patriotic-blue hover:bg-hpa-patriotic-blue/90 text-white"
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              )}
  
              {formState.step === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-hpa-blue-900 mb-4">Care Recipient Information</h2>
                    <p className="text-hpa-neutral-600 mb-6">Tell us about the person who needs care so we can find the best options.</p>
                  </div>
  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="receiverName">Care Recipient's Name</Label>
                      <Input 
                        id="receiverName" 
                        name="receiverName" 
                        value={formData.relationshipToReceiver === 'self' ? `${formData.firstName} ${formData.lastName}` : formData.receiverName} 
                        onChange={handleInputChange} 
                        required={formData.relationshipToReceiver !== 'self'} 
                        disabled={formData.relationshipToReceiver === 'self'}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="receiverAge">Care Recipient's Age</Label>
                      <Input 
                        id="receiverAge" 
                        name="receiverAge" 
                        type="number" 
                        min="0"
                        max="120"
                        value={formData.receiverAge} 
                        onChange={handleInputChange} 
                        required 
                      />
                    </div>
                  </div>
  
                  <div className="space-y-2">
                    <Label htmlFor="receiverLocation">Location (City, State)</Label>
                    <Input 
                      id="receiverLocation" 
                      name="receiverLocation" 
                      value={formData.receiverLocation || initialParams.location || ''} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>
  
                  <div className="space-y-2">
                    <Label className="block mb-3">What type of assistance is needed? (Select all that apply)</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {needsOptions.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <Checkbox 
                            id={option.value} 
                            checked={formData.receiverNeeds.includes(option.value)}
                            onCheckedChange={(checked) => {
                              if (checked) handleCheckboxChange(option.value);
                              else handleCheckboxChange(option.value);
                            }}
                          />
                          <Label htmlFor={option.value} className="cursor-pointer">{option.label}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
  
                  <div className="flex justify-between mt-6">
                    <Button 
                      type="button" 
                      onClick={() => setFormState(prev => ({ ...prev, step: 1 }))}
                      variant="outline"
                    >
                      Back
                    </Button>
                    <Button 
                      type="button" 
                      onClick={() => setFormState(prev => ({ ...prev, step: 3 }))}
                      className="bg-hpa-patriotic-blue hover:bg-hpa-patriotic-blue/90 text-white"
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              )}
  
              {formState.step === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-hpa-blue-900 mb-4">Care Preferences</h2>
                    <p className="text-hpa-neutral-600 mb-6">Let's narrow down the best care options based on specific needs and preferences.</p>
                  </div>
  
                  <div className="space-y-4">
                    <Label>Mobility Level</Label>
                    <RadioGroup 
                      value={formData.mobilityLevel} 
                      onValueChange={(value) => handleSelectChange('mobilityLevel', value)}
                      className="grid grid-cols-1 gap-3"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="independent" id="mobility-independent" />
                        <Label htmlFor="mobility-independent">Fully independent</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="walker" id="mobility-walker" />
                        <Label htmlFor="mobility-walker">Uses walker/cane</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="wheelchair" id="mobility-wheelchair" />
                        <Label htmlFor="mobility-wheelchair">Wheelchair dependent</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="bedridden" id="mobility-bedridden" />
                        <Label htmlFor="mobility-bedridden">Mostly bedridden</Label>
                      </div>
                    </RadioGroup>
                  </div>
  
                  <div className="space-y-4">
                    <Label>Cognitive Status</Label>
                    <RadioGroup 
                      value={formData.cognitiveStatus} 
                      onValueChange={(value) => handleSelectChange('cognitiveStatus', value)}
                      className="grid grid-cols-1 gap-3"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="normal" id="cognitive-normal" />
                        <Label htmlFor="cognitive-normal">No cognitive issues</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="mild" id="cognitive-mild" />
                        <Label htmlFor="cognitive-mild">Mild memory problems</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="moderate" id="cognitive-moderate" />
                        <Label htmlFor="cognitive-moderate">Moderate memory/cognitive issues</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="severe" id="cognitive-severe" />
                        <Label htmlFor="cognitive-severe">Diagnosed with dementia/Alzheimer's</Label>
                      </div>
                    </RadioGroup>
                  </div>
  
                  <div className="space-y-2">
                    <Label htmlFor="medicalConditions">Relevant Medical Conditions</Label>
                    <Textarea 
                      id="medicalConditions" 
                      name="medicalConditions" 
                      placeholder="Please list any relevant medical conditions"
                      value={formData.medicalConditions} 
                      onChange={handleInputChange} 
                      className="min-h-24"
                    />
                  </div>
  
                  <div className="flex justify-between mt-6">
                    <Button 
                      type="button" 
                      onClick={() => setFormState(prev => ({ ...prev, step: 2 }))}
                      variant="outline"
                    >
                      Back
                    </Button>
                    <Button 
                      type="button" 
                      onClick={() => setFormState(prev => ({ ...prev, step: 4 }))}
                      className="bg-hpa-patriotic-blue hover:bg-hpa-patriotic-blue/90 text-white"
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              )}
  
              {formState.step === 4 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-hpa-blue-900 mb-4">Additional Preferences</h2>
                    <p className="text-hpa-neutral-600 mb-6">Final details to help us provide the best care recommendations.</p>
                  </div>
  
                  <div className="space-y-4">
                    <Label>Preferred Living Arrangement</Label>
                    <RadioGroup 
                      value={formData.livingPreference} 
                      onValueChange={(value) => handleSelectChange('livingPreference', value)}
                      className="grid grid-cols-1 gap-3"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="home" id="living-home" />
                        <Label htmlFor="living-home">Stay at home with support</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="community" id="living-community" />
                        <Label htmlFor="living-community">Move to a senior living community</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="family" id="living-family" />
                        <Label htmlFor="living-family">Live with family member</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="undecided" id="living-undecided" />
                        <Label htmlFor="living-undecided">Undecided/Need guidance</Label>
                      </div>
                    </RadioGroup>
                  </div>
  
                  <div className="space-y-2">
                    <Label htmlFor="budgetRange">Monthly Budget Range</Label>
                    <Select
                      value={formData.budgetRange}
                      onValueChange={(value) => handleSelectChange('budgetRange', value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select budget range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="under-2000">Under $2,000/month</SelectItem>
                        <SelectItem value="2000-4000">$2,000 - $4,000/month</SelectItem>
                        <SelectItem value="4000-6000">$4,000 - $6,000/month</SelectItem>
                        <SelectItem value="6000-8000">$6,000 - $8,000/month</SelectItem>
                        <SelectItem value="8000-plus">$8,000+/month</SelectItem>
                        <SelectItem value="unknown">Not sure/Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
  
                  <div className="space-y-2">
                    <Label htmlFor="urgency">How soon is care needed?</Label>
                    <Select
                      value={formData.urgency}
                      onValueChange={(value) => handleSelectChange('urgency', value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select timeframe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">Immediately</SelectItem>
                        <SelectItem value="30days">Within 30 days</SelectItem>
                        <SelectItem value="60days">Within 1-2 months</SelectItem>
                        <SelectItem value="90days">Within 3 months</SelectItem>
                        <SelectItem value="planning">Just planning ahead</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
  
                  <div className="space-y-2">
                    <Label htmlFor="additionalInfo">Any additional information that would help us?</Label>
                    <Textarea 
                      id="additionalInfo" 
                      name="additionalInfo" 
                      placeholder="Please share any other details that would help us find the right care solution"
                      value={formData.additionalInfo} 
                      onChange={handleInputChange} 
                      className="min-h-24"
                    />
                  </div>
  
                  {formState.error && (
                    <div className="text-red-500 bg-red-50 p-3 rounded-md">
                      {formState.error}
                    </div>
                  )}
  
                  <div className="flex justify-between mt-6">
                    <Button 
                      type="button" 
                      onClick={() => setFormState(prev => ({ ...prev, step: 3 }))}
                      variant="outline"
                    >
                      Back
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-hpa-patriotic-blue hover:bg-hpa-patriotic-blue/90 text-white flex items-center gap-2"
                      disabled={formState.isSubmitting}
                    >
                      {formState.isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                      Get Care Recommendations
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmbeddableCareForm;
