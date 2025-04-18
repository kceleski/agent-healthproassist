
import React from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import type { Facility } from "@/types/facility";
import { getRatingStars } from "../utils/rating-stars";

interface ListViewFacilityCardProps {
  facility: Facility;
  index: number;
}

export function ListViewFacilityCard({ facility, index }: ListViewFacilityCardProps) {
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
