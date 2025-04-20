export interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  latitude: number;
  longitude: number;
  facilityType: string[];
  careLevel: string[];
  rating: number;
  priceRange: string;
  amenities: string[];
  beds: number;
  availability: boolean;
  imageUrl?: string;
  website?: string;
  phone?: string;
  description?: string;
  insurance?: string[];
  medicalNeeds?: string[];
  contactPerson?: string;
  contactPersonImage?: string;
  contactTitle?: string;
  matchScore?: number;
  matchReasons?: string[];
}