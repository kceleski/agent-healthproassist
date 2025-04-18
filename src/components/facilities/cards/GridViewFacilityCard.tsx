
import React from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import type { Facility } from "@/types/facility";
import { getRatingStars } from "../utils/rating-stars";

interface GridViewFacilityCardProps {
  facility: Facility;
  index: number;
}

export function GridViewFacilityCard({ facility, index }: GridViewFacilityCardProps) {
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
