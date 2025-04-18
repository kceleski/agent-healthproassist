
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe, Star } from "lucide-react";
import type { Facility } from "@/types/facility";

interface FacilityCardProps {
  facility: Facility;
  index: number;
  isPro?: boolean;
  viewMode?: "grid" | "list";
}

export function FacilityCard({ facility, index, isPro = false, viewMode = "grid" }: FacilityCardProps) {
  const getRatingStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex items-center">
        {Array(fullStars).fill(0).map((_, i) => (
          <Star key={`full-${i}`} className="w-4 h-4 fill-healthcare-400 text-healthcare-400" />
        ))}
        {hasHalfStar && (
          <div className="relative">
            <Star className="w-4 h-4 text-healthcare-400" />
            <Star className="w-4 h-4 fill-healthcare-400 text-healthcare-400 absolute top-0 left-0" style={{ clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)' }} />
          </div>
        )}
        {Array(5 - fullStars - (hasHalfStar ? 1 : 0)).fill(0).map((_, i) => (
          <Star key={`empty-${i}`} className="w-4 h-4 text-healthcare-400" />
        ))}
        <span className="ml-1 text-sm">{rating}</span>
      </div>
    );
  };

  if (!isPro) {
    return (
      <Card className="glass-card overflow-hidden transition-all duration-300 hover:shadow-lg animate-zoom-in" style={{ animationDelay: `${index * 100}ms` }}>
        <CardContent className="p-0">
          <div className="relative">
            <img 
              src={facility.image} 
              alt={facility.name} 
              className="h-48 w-full object-cover"
            />
            <div className="absolute top-3 left-3">
              <Badge className="bg-white/80 backdrop-blur-sm text-healthcare-700 border-none">
                {facility.type}
              </Badge>
            </div>
          </div>
          
          <div className="p-4">
            <h3 className="font-medium text-lg">{facility.name}</h3>
            
            <div className="flex items-center gap-1 my-2">
              <Globe className="h-3 w-3 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{facility.location}</span>
            </div>
            
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">Recently viewed</p>
            
            <div className="border-t pt-3 mt-2">
              <span className="text-sm text-muted-foreground">
                Last viewed recently
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (viewMode === "list") {
    return (
      <Card className="glass-card overflow-hidden animate-zoom-in" style={{ animationDelay: `${index * 100}ms` }}>
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-48 h-48 shrink-0">
              <img 
                src={facility.image} 
                alt={facility.name} 
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-4 flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <Link to={`/facilities/${facility.id}`}>
                    <h3 className="font-medium text-lg hover:text-healthcare-600 transition-colors">{facility.name}</h3>
                  </Link>
                  
                  <div className="flex items-center gap-1 my-1">
                    <Globe className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{facility.location}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className="bg-healthcare-100 text-healthcare-700">
                    {facility.type}
                  </Badge>
                  <Badge className="bg-healthcare-100 text-healthcare-700">
                    {facility.price}
                  </Badge>
                  <div className="ml-2">
                    {getRatingStars(facility.rating)}
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground my-2">{facility.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-3 mt-3">
                {facility.amenities.map((amenity: string, i: number) => (
                  <Badge key={i} variant="outline" className="bg-healthcare-50 text-xs font-normal">
                    {amenity}
                  </Badge>
                ))}
              </div>
              
              <div className="flex items-center justify-between border-t pt-3 mt-2">
                <span className="text-sm">
                  <span className="font-medium">{facility.availableBeds}</span> beds available
                </span>
                <Button asChild size="sm" className="bg-healthcare-600">
                  <Link to={`/facilities/${facility.id}`}>View Details</Link>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-zoom-in" style={{ animationDelay: `${index * 100}ms` }}>
      <CardContent className="p-0">
        <div className="relative">
          <img 
            src={facility.image} 
            alt={facility.name} 
            className="h-48 w-full object-cover"
          />
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge className="bg-white/80 backdrop-blur-sm text-healthcare-700 border-none">
              {facility.type}
            </Badge>
            <Badge className="bg-white/80 backdrop-blur-sm text-healthcare-700 border-none">
              {facility.price}
            </Badge>
          </div>
        </div>
        
        <div className="p-4">
          <Link to={`/facilities/${facility.id}`}>
            <h3 className="font-medium text-lg hover:text-healthcare-600 transition-colors">{facility.name}</h3>
          </Link>
          
          <div className="flex items-center gap-1 my-2">
            <Globe className="h-3 w-3 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{facility.location}</span>
          </div>
          
          <div className="my-2">
            {getRatingStars(facility.rating)}
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{facility.description}</p>
          
          <div className="flex flex-wrap gap-2 mb-3">
            {facility.amenities.slice(0, 3).map((amenity: string, i: number) => (
              <Badge key={i} variant="outline" className="bg-healthcare-50 text-xs font-normal">
                {amenity}
              </Badge>
            ))}
            {facility.amenities.length > 3 && (
              <Badge variant="outline" className="bg-healthcare-50 text-xs font-normal">
                +{facility.amenities.length - 3} more
              </Badge>
            )}
          </div>
          
          <div className="flex items-center justify-between border-t pt-3">
            <span className="text-sm">
              <span className="font-medium">{facility.availableBeds}</span> beds available
            </span>
            <Button asChild size="sm" className="bg-healthcare-600">
              <Link to={`/facilities/${facility.id}`}>View Details</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
