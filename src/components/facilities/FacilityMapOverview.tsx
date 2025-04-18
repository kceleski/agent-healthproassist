
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapIcon } from "lucide-react";

interface FacilityMapOverviewProps {
  isPro: boolean;
}

export function FacilityMapOverview({ isPro }: FacilityMapOverviewProps) {
  return (
    <Card className="glass-card overflow-hidden mb-8 animate-zoom-in">
      <CardContent className="p-0">
        <div className="relative">
          <div className="h-[400px] bg-muted rounded-t-lg overflow-hidden">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d100939.98555098464!2d-122.44761267845324!3d37.75781499602548!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1625234961372!5m2!1sen!2sus" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy"
              title="Facility Map"
            ></iframe>
          </div>
          <div className="absolute bottom-4 right-4">
            <Button className="bg-white text-healthcare-700 hover:bg-white/90">
              <MapIcon className="h-4 w-4 mr-2" />
              Open Full Map
            </Button>
          </div>
        </div>
        
        <div className="p-4 border-t">
          <h3 className="font-medium mb-2">Find Facilities Near You</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {isPro 
              ? "Use the interactive map to explore senior care facilities in your area. Click on a marker to see details." 
              : "Search for facilities near you. Upgrade to Pro for full interactive mapping capabilities."}
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-healthcare-50">San Francisco, CA</Badge>
            <Badge variant="outline" className="bg-healthcare-50">Oakland, CA</Badge>
            <Badge variant="outline" className="bg-healthcare-50">San Jose, CA</Badge>
            <Badge variant="outline" className="bg-healthcare-50">Palo Alto, CA</Badge>
            <Badge variant="outline" className="bg-healthcare-50">Los Angeles, CA</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
