
declare global {
  namespace google {
    namespace maps {
      class Map {
        constructor(mapDiv: Element, opts?: MapOptions);
        setCenter(latLng: LatLng | LatLngLiteral): void;
        getCenter(): LatLng;
        setZoom(zoom: number): void;
        getZoom(): number;
        addListener(eventName: string, handler: Function): MapsEventListener;
        fitBounds(bounds: LatLngBounds | LatLngBoundsLiteral, padding?: number | Padding): void;
        setFog(options: FogOptions): void;
      }

      class Marker {
        constructor(opts?: MarkerOptions);
        setMap(map: Map | null): void;
        getPosition(): LatLng | null;
        setAnimation(animation: any): void;
        get(key: string): any;
        set(key: string, value: any): void;
        addListener(eventName: string, handler: Function): MapsEventListener;
      }

      class InfoWindow {
        constructor(opts?: InfoWindowOptions);
        open(map: Map, anchor?: MVCObject | Marker): void;
        close(): void;
        setContent(content: string | Node): void;
      }

      class LatLng {
        constructor(lat: number, lng: number, noWrap?: boolean);
        lat(): number;
        lng(): number;
        toString(): string;
        toUrlValue(precision?: number): string;
      }

      class LatLngBounds {
        constructor(sw?: LatLng | LatLngLiteral, ne?: LatLng | LatLngLiteral);
        extend(point: LatLng | LatLngLiteral): LatLngBounds;
        contains(latLng: LatLng | LatLngLiteral): boolean;
        getCenter(): LatLng;
      }

      class Geocoder {
        geocode(request: GeocoderRequest, callback: (results: GeocoderResult[], status: GeocoderStatus) => void): void;
      }

      namespace places {
        class PlacesService {
          constructor(attrContainer: HTMLElement | Map);
          nearbySearch(request: PlaceSearchRequest, callback: (results: PlaceResult[] | null, status: PlacesServiceStatus, pagination: PlaceSearchPagination | null) => void): void;
          getDetails(request: PlaceDetailsRequest, callback: (result: PlaceResult | null, status: PlacesServiceStatus) => void): void;
        }

        interface PlaceSearchRequest {
          location: LatLng | LatLngLiteral;
          radius: number;
          keyword?: string;
          type?: string;
        }

        interface PlaceSearchPagination {
          hasNextPage: boolean;
          nextPage(): void;
        }

        interface PlaceDetailsRequest {
          placeId: string;
          fields?: string[];
        }

        interface PlaceResult {
          name?: string;
          place_id?: string;
          vicinity?: string;
          rating?: number;
          user_ratings_total?: number;
          geometry?: {
            location: LatLng;
            viewport?: LatLngBounds;
          };
          photos?: {
            height: number;
            width: number;
            getUrl(opts: { maxWidth: number; maxHeight: number }): string;
          }[];
        }

        const PlacesServiceStatus: {
          OK: string;
          ZERO_RESULTS: string;
          OVER_QUERY_LIMIT: string;
          REQUEST_DENIED: string;
          INVALID_REQUEST: string;
          UNKNOWN_ERROR: string;
        };
      }

      interface FogOptions {
        color?: string;
        'high-color'?: string;
        'horizon-blend'?: number;
      }

      interface MVCObject {
        addListener(eventName: string, handler: Function): MapsEventListener;
      }

      interface MapOptions {
        center?: LatLng | LatLngLiteral;
        zoom?: number;
        minZoom?: number;
        maxZoom?: number;
        styles?: any[];
        mapTypeId?: string;
        tilt?: number;
        heading?: number;
        mapId?: string;
        mapTypeControl?: boolean;
        fullscreenControl?: boolean;
        streetViewControl?: boolean;
      }

      interface LatLngLiteral {
        lat: number;
        lng: number;
      }

      interface LatLngBoundsLiteral {
        east: number;
        north: number;
        south: number;
        west: number;
      }

      interface Padding {
        top: number;
        right: number;
        bottom: number;
        left: number;
      }

      interface MarkerOptions {
        position: LatLng | LatLngLiteral;
        map?: Map;
        title?: string;
        animation?: any;
        icon?: string | Icon;
        label?: string | MarkerLabel;
      }

      interface InfoWindowOptions {
        content?: string | Node;
        disableAutoPan?: boolean;
        maxWidth?: number;
        pixelOffset?: Size;
        position?: LatLng | LatLngLiteral;
      }

      interface Icon {
        url: string;
        size?: Size;
        scaledSize?: Size;
        origin?: Point;
        anchor?: Point;
      }

      interface MarkerLabel {
        text: string;
        color?: string;
        fontFamily?: string;
        fontSize?: string;
        fontWeight?: string;
      }

      interface Size {
        width: number;
        height: number;
      }

      interface Point {
        x: number;
        y: number;
      }

      interface MapsEventListener {
        remove(): void;
      }

      interface GeocoderRequest {
        address?: string;
        location?: LatLng | LatLngLiteral;
        placeId?: string;
        bounds?: LatLngBounds | LatLngBoundsLiteral;
        componentRestrictions?: GeocoderComponentRestrictions;
        region?: string;
      }

      interface GeocoderComponentRestrictions {
        country: string | string[];
      }

      interface GeocoderResult {
        address_components: {
          long_name: string;
          short_name: string;
          types: string[];
        }[];
        formatted_address: string;
        geometry: {
          location: LatLng;
          location_type: string;
          viewport: LatLngBounds;
        };
        place_id: string;
        types: string[];
      }

      type GeocoderStatus = "OK" | "ZERO_RESULTS" | "OVER_QUERY_LIMIT" | "REQUEST_DENIED" | "INVALID_REQUEST" | "UNKNOWN_ERROR";

      const event: {
        removeListener(listener: MapsEventListener): void;
      };

      const Animation: {
        BOUNCE: number;
        DROP: number;
        NONE: number;
      };

      const MapTypeId: {
        ROADMAP: string;
        SATELLITE: string;
        HYBRID: string;
        TERRAIN: string;
      };
    }
  }
}

export {};  // This exports nothing but tells TypeScript this is a module
