
export interface FacilityData {
  id: string;
  name: string;
  type: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email?: string;
  website: string;
  description: string;
  services: string[];
  amenities: string[];
  images: string[];
  ctaText: string;
  ctaButtons: Array<{
    text: string;
    link: string;
  }>;
}
