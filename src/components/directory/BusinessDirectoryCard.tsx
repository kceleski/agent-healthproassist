
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Globe, Heart } from "lucide-react";
import { FacilityData } from "@/types/facility";

interface BusinessDirectoryCardProps {
  facility: FacilityData;
}

export const BusinessDirectoryCard = ({ facility }: BusinessDirectoryCardProps) => {
  const primaryImage = facility.images?.[0] || "/placeholder.svg";

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-200">
      <div className="relative h-48 overflow-hidden rounded-t-lg">
        <img 
          src={primaryImage} 
          alt={facility.name}
          className="w-full h-full object-cover"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-white/80 hover:bg-white"
        >
          <Heart className="h-4 w-4" />
        </Button>
      </div>
      
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg line-clamp-2">{facility.name}</CardTitle>
          <Badge variant="secondary" className="ml-2 shrink-0">
            {facility.type}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <div className="space-y-3">
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
            <div>
              <div>{facility.address}</div>
              <div>{facility.city}, {facility.state} {facility.zip}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4" />
            <span>{facility.phone}</span>
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-3">
            {facility.description}
          </p>
          
          {facility.services.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Services</h4>
              <div className="flex flex-wrap gap-1">
                {facility.services.slice(0, 3).map((service, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {service}
                  </Badge>
                ))}
                {facility.services.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{facility.services.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          )}
          
          {facility.amenities.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Amenities</h4>
              <div className="flex flex-wrap gap-1">
                {facility.amenities.slice(0, 3).map((amenity, index) => (
                  <Badge key={index} variant="outline" className="text-xs bg-healthcare-50">
                    {amenity}
                  </Badge>
                ))}
                {facility.amenities.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{facility.amenities.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-3 border-t">
        <div className="w-full space-y-2">
          <p className="text-sm text-center text-muted-foreground">
            {facility.ctaText}
          </p>
          <div className="flex gap-2">
            {facility.ctaButtons.map((button, index) => (
              <Button 
                key={index}
                asChild 
                className={index === 0 ? "flex-1" : "flex-1"} 
                variant={index === 0 ? "default" : "outline"}
              >
                <a href={button.link} target="_blank" rel="noopener noreferrer">
                  {index === 0 && <Globe className="h-4 w-4 mr-2" />}
                  {button.text}
                </a>
              </Button>
            ))}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
