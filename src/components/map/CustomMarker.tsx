import React from 'react';

interface CustomMarkerProps {
  facilityType: string;
  selected?: boolean;
}

export const createCustomMarkerIcon = (facilityType: string, selected: boolean = false): google.maps.Symbol => {
  // Get color based on facility type
  const color = getFacilityColor(facilityType);
  
  // Create a custom SVG path for a futuristic marker
  return {
    path: 'M12,0C7.58,0,4,3.58,4,8c0,5.76,7.34,14,7.58,14.31c0.19,0.24,0.53,0.24,0.71,0C12.66,22,20,13.76,20,8C20,3.58,16.42,0,12,0z M12,11c-1.66,0-3-1.34-3-3s1.34-3,3-3s3,1.34,3,3S13.66,11,12,11z',
    fillColor: color,
    fillOpacity: selected ? 1 : 0.7,
    strokeWeight: 2,
    strokeColor: selected ? '#FFFFFF' : color,
    scale: selected ? 1.5 : 1.2,
    anchor: new google.maps.Point(12, 24),
  };
};

// Helper function to get color based on facility type
export const getFacilityColor = (facilityType: string): string => {
  switch (facilityType?.toLowerCase()) {
    case 'assisted living':
      return '#4CAF50'; // Green
    case 'memory care':
      return '#2196F3'; // Blue
    case 'skilled nursing':
      return '#F44336'; // Red
    case 'independent living':
      return '#9C27B0'; // Purple
    default:
      return '#FF9800'; // Orange
  }
};