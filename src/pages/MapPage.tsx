
import { Helmet } from "react-helmet";
import { Badge } from "@/components/ui/badge";
import FacilityMapboxPro from "@/components/maps/FacilityMapboxPro";

const MapPage = () => {
  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Find Senior Care Facilities</h1>
        <Badge variant="outline" className="bg-healthcare-100 text-healthcare-700 px-3 py-1">
          Pro Version
        </Badge>
      </div>
      <p className="text-muted-foreground mb-6">
        Use the interactive map below to explore healthcare facilities. Enter specific search terms like "nursing homes near Phoenix" or "assisted living in Chicago" to find exactly what you're looking for.
        <span className="ml-2 text-healthcare-600">
          All search results are powered by live data through SerpAPI integration.
        </span>
      </p>
      
      {/* Render our Pro FacilityMapbox component with SerpAPI integration */}
      <FacilityMapboxPro />
      
      {/* Include necessary styles and scripts */}
      <Helmet>
        <script src="https://unpkg.com/@turf/turf@6.5.0/turf.min.js"></script>
      </Helmet>
    </div>
  );
};

export default MapPage;
