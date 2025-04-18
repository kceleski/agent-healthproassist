
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { FilterType, LocationArea } from '@/hooks/use-facility-map';

interface AvaFacilityMapProps {
  isPro: boolean;
  mapRef: React.RefObject<HTMLDivElement>;
  activeFilter: FilterType;
  activeLocation: LocationArea;
}

export function AvaFacilityMap({ 
  isPro, 
  mapRef,
  activeFilter,
  activeLocation
}: AvaFacilityMapProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <MapPin className="h-5 w-5 mr-2" />
          Senior Care Facilities Map
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative h-[600px]">
          <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2">
            {activeFilter !== 'all' && (
              <Badge className="bg-healthcare-600">
                {activeFilter.split('-').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </Badge>
            )}
            {activeLocation !== 'all' && (
              <Badge className="bg-healthcare-600">
                {activeLocation.split('-').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </Badge>
            )}
          </div>
        
          {isPro ? (
            <div ref={mapRef} className="h-full rounded-b-lg"></div>
          ) : (
            <div className="h-full rounded-b-lg bg-slate-100 flex items-center justify-center">
              <div className="text-center p-6">
                <MapPin className="h-12 w-12 text-healthcare-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Interactive Map</h3>
                <p className="text-muted-foreground mb-4 max-w-xs">
                  Upgrade to Pro to access our interactive map and search for senior care facilities near you.
                </p>
                <Button asChild className="bg-healthcare-600">
                  <a href="/profile">Upgrade to Pro</a>
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      {isPro && (
        <div className="text-center text-xs text-muted-foreground py-2 border-t">
          Map data ©{new Date().getFullYear()} Google
        </div>
      )}
    </Card>
  );
}
