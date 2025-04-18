
export type FacilityType = "Assisted Living" | "Memory Care" | "Skilled Nursing" | "Independent Living";
export type Location = "San Francisco, CA" | "Oakland, CA" | "San Jose, CA" | "Palo Alto, CA" | "Los Angeles, CA";

// Coordinates for use with Google Maps
export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Facility {
  id: string;
  name: string;
  type: FacilityType;
  rating: number;
  location: Location;
  price: string;
  image: string;
  amenities: string[];
  availableBeds: number;
  description: string;
  vicinity?: string;
  coordinates?: Coordinates;
}
