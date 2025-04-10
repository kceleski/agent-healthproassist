
declare namespace google {
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
      scrollZoom: {
        disable(): void;
        enable(): void;
      };
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

    const event: {
      removeListener(listener: MapsEventListener): void;
    };

    const Animation: {
      BOUNCE: number;
      DROP: number;
      NONE: number;
    };
  }
}

