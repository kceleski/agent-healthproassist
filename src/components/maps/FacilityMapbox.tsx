
// components/maps/FacilityMapbox.tsx

import React, { useEffect, useState } from "react";

interface FacilityMapboxProps {
  location: string;
  selectedCareType: string;
  selectedAmenities: string[];
}

// Replace this with your actual Storepoint embed URL
const BASE_URL = "https://yourstorepointurl.com/embed";

const FacilityMapbox: React.FC<FacilityMapboxProps> = ({
  location,
  selectedCareType,
  selectedAmenities,
}) => {
  const [iframeSrc, setIframeSrc] = useState(BASE_URL);

  useEffect(() => {
    // Only run in the browser environment
    if (typeof window !== 'undefined') {
      let query = location;

      if (selectedCareType && selectedCareType !== "any") {
        query += ` ${selectedCareType}`;
      }

      if (selectedAmenities.length > 0) {
        query += ` ${selectedAmenities.join(" ")}`;
      }

      const fullUrl = `${BASE_URL}?search=${encodeURIComponent(query.trim())}`;
      setIframeSrc(fullUrl);
    }
  }, [location, selectedCareType, selectedAmenities]);

  return (
    <div className="w-full rounded-xl overflow-hidden border shadow">
      <iframe
        title="Facility Locator"
        src={iframeSrc}
        width="100%"
        height="600"
        frameBorder="0"
        loading="lazy"
      />
    </div>
  );
};

export default FacilityMapbox;
