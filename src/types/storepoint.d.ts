
// StorePoint SDK type definitions

interface StorepointSDK {
  options: {
    maxLocations: number;
    defaultView: string;
    [key: string]: any;
  };
  on: (eventName: string, callback: (location: any) => void) => void;
  filter: (field: string, value: string | null) => void;
  [key: string]: any;
}

interface StorepointLocation {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  latitude: number;
  longitude: number;
  tags: string[];
  [key: string]: any;
}

// Extend the Window interface
declare global {
  interface Window {
    SP: StorepointSDK | undefined;
    selectedLocation: StorepointLocation | null;
  }
}

export {};
