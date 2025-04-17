
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, MapPin, Building2, DollarSign, Heart, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

interface FacilitySearchCardProps {
  facility: {
    id: string;
    name: string;
    address?: string;
    rating?: number;
    description?: string;
    type?: string;
    price?: string;
    amenities?: string[];
    url?: string;
    latitude?: number;
    longitude?: number;
  };
  onSave?: (facility: any) => void;
  isSaved?: boolean;
}

export const FacilitySearchCard = ({ facility, onSave, isSaved }: FacilitySearchCardProps) => {
  const renderRating = (rating?: number) => {
    if (!rating) return null;
    return (
      <div className="flex items-center space-x-1">
        <Star className="h-4 w-4 text-yellow-400 fill-current" />
        <span className="text-sm font-medium">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-lg">
      <CardContent className="p-0">
        <div className="relative">
          <div 
            className="h-48 w-full bg-cover bg-center bg-healthcare-100"
            style={{ 
              backgroundImage: `url(https://images.unsplash.com/photo-1571055107559-3e67626fa8be?auto=format&fit=crop&w=800&q=80)` 
            }}
          />
          <div className="absolute top-4 left-4 flex gap-2">
            {facility.type && (
              <Badge className="bg-white/90 text-healthcare-700 backdrop-blur-sm">
                {facility.type}
              </Badge>
            )}
            {facility.price && (
              <Badge className="bg-white/90 text-healthcare-700 backdrop-blur-sm">
                {facility.price}
              </Badge>
            )}
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-lg line-clamp-2">{facility.name}</h3>
              {renderRating(facility.rating)}
            </div>

            {facility.address && (
              <div className="flex items-center mt-2 text-muted-foreground">
                <MapPin className="h-4 w-4 mr-1 shrink-0" />
                <span className="text-sm line-clamp-1">{facility.address}</span>
              </div>
            )}
          </div>

          {facility.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {facility.description}
            </p>
          )}

          {facility.amenities && facility.amenities.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {facility.amenities.slice(0, 3).map((amenity, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="bg-healthcare-50"
                >
                  {amenity}
                </Badge>
              ))}
              {facility.amenities.length > 3 && (
                <Badge 
                  variant="outline" 
                  className="bg-healthcare-50"
                >
                  +{facility.amenities.length - 3} more
                </Badge>
              )}
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSave?.(facility)}
              className={isSaved ? "text-red-500" : ""}
            >
              <Heart 
                className="h-4 w-4 mr-2" 
                fill={isSaved ? "currentColor" : "none"}
              />
              {isSaved ? "Saved" : "Save"}
            </Button>

            <div className="flex gap-2">
              {facility.url && (
                <Button 
                  variant="outline" 
                  size="sm"
                  asChild
                >
                  <a 
                    href={facility.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Website
                  </a>
                </Button>
              )}
              <Button 
                size="sm"
                className="bg-healthcare-600 hover:bg-healthcare-700"
                asChild
              >
                <Link to={`/facilities/${facility.id}`}>
                  View Details
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
