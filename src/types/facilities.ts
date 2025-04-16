
export interface Facility {
  id: string;
  name: string;
  address: string;
  rating: number;
  description: string;
  url: string;
  latitude: number;
  longitude: number;
}

export const careTypes = [
  { id: "any", label: "Any Care Type" },
  { id: "assisted_living", label: "Assisted Living" },
  { id: "memory_care", label: "Memory Care" },
  { id: "home_health", label: "Home Health" },
  { id: "independent_living", label: "Independent Living" },
] as const;

export const amenities = [
  { id: "pool", label: "Swimming Pool" },
  { id: "fitness", label: "Fitness Center" },
  { id: "dining", label: "Fine Dining" },
  { id: "transport", label: "Transportation" },
  { id: "activities", label: "Social Activities" },
  { id: "pets", label: "Pet Friendly" },
] as const;
