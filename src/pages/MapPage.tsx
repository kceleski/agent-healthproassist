
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import FacilityMapbox from "@/components/maps/FacilityMapbox";

// Declare the global SP object that StorePoint provides
declare global {
  interface Window {
    SP: any;
    selectedLocation: any;
  }
}

const MapPage = () => {
  const { user } = useAuth();
  const isPro = (user?.demoTier || user?.subscription) === 'premium';
  
  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Find Senior Care Facilities</h1>
        <Badge variant="outline" className="bg-healthcare-100 text-healthcare-700 px-3 py-1">
          {isPro ? 'Pro' : 'Basic'} Feature
        </Badge>
      </div>
      <p className="text-muted-foreground mb-6">
        Use the interactive map below to explore senior care facilities in your area. Click on a marker to see details about each location.
        {!isPro && (
          <span className="ml-2 text-healthcare-600">
            Note: Basic tier has limited filtering options. <a href="/profile" className="underline">Upgrade to Pro</a> for advanced features.
          </span>
        )}
      </p>
      
      {/* Render our new FacilityMapbox component */}
      <FacilityMapbox />
      
      {/* Include necessary styles and scripts */}
      <Helmet>
        <script src="https://unpkg.com/@turf/turf@6.5.0/turf.min.js"></script>
      </Helmet>
    </div>
  );
};

export default MapPage;
