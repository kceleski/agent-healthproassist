
// StorePoint map interface declaration
interface SPOptions {
  maxLocations?: number;
  defaultView?: 'map' | 'list';
  // Add other options as needed
}

interface SPLocation {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  lat: number;
  lng: number;
  tags?: string[];
  // Add other location properties as needed
}

interface SPInstance {
  options: SPOptions;
  filter(field: string, value: string | null): void;
  on(event: string, callback: (location: SPLocation) => void): void;
  // Add other methods as needed
}

// Extend Window interface
declare global {
  interface Window {
    SP: SPInstance;
    selectedLocation?: SPLocation;
  }
}
