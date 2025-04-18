
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Globe } from "lucide-react";
import type { Facility } from "@/types/facility";

interface BasicFacilityCardProps {
  facility: Facility;
  index: number;
}

export function BasicFacilityCard({ facility, index }: BasicFacilityCardProps) {
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
