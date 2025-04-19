
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { MapPin, Search } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SearchCriteriaProps {
  location: string;
  setLocation: (location: string) => void;
  selectedCareType: string;
  setSelectedCareType: (type: string) => void;
  selectedAmenities: string[];
  toggleAmenity: (amenityId: string) => void;
  handleSearch: () => void;
  isLoading: boolean;
  careTypes: Array<{id: string, label: string}>;
  amenities: Array<{id: string, label: string}>;
}

export const SearchCriteriaCard = ({
  location,
  setLocation,
  selectedCareType,
  setSelectedCareType,
  selectedAmenities,
  toggleAmenity,
  handleSearch,
  isLoading,
  careTypes,
  amenities
}: SearchCriteriaProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Search Criteria</CardTitle>
        <CardDescription>
          Enter details below to find suitable facilities for your clients
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="location" className="text-healthcare-700">Location</Label>
            <div className="relative">
              <Input
                id="location"
                placeholder="City, state or zip code"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pr-8"
              />
              <MapPin className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          
          <div>
            <Label htmlFor="care-type" className="text-healthcare-700">Care Type</Label>
            <Select
              value={selectedCareType}
              onValueChange={setSelectedCareType}
            >
              <SelectTrigger id="care-type" className="border-healthcare-200">
                <SelectValue placeholder="Select care type" />
              </SelectTrigger>
              <SelectContent>
                {careTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div>
          <Label className="text-healthcare-700 mb-3 block">Amenities</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {amenities.map((amenity) => (
              <div key={amenity.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`amenity-${amenity.id}`}
                  checked={selectedAmenities.includes(amenity.id)}
                  onCheckedChange={() => toggleAmenity(amenity.id)}
                />
                <label
                  htmlFor={`amenity-${amenity.id}`}
                  className="text-sm font-medium leading-none text-healthcare-700 cursor-pointer"
                >
                  {amenity.label}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        <Button 
          onClick={handleSearch}
          disabled={isLoading}
          className="w-full sm:w-auto bg-healthcare-600 hover:bg-healthcare-700 text-white"
          size="lg"
        >
          <Search className="h-4 w-4 mr-2" />
          {isLoading ? "Searching..." : "Search Facilities"}
        </Button>
      </CardContent>
    </Card>
  );
};
