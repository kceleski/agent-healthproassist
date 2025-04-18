
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronDown, Filter, Globe, RefreshCw, SlidersHorizontal } from "lucide-react";
import type { FacilityType, Location } from "@/types/facility";

interface FacilityFiltersProps {
  selectedTypes: FacilityType[];
  selectedLocations: Location[];
  toggleTypeSelection: (type: FacilityType) => void;
  toggleLocationSelection: (location: Location) => void;
  handleFilterReset: () => void;
  handleFilterApply: () => void;
  filterOpen: boolean;
  setFilterOpen: (open: boolean) => void;
}

export function FacilityFilters({
  selectedTypes,
  selectedLocations,
  toggleTypeSelection,
  toggleLocationSelection,
  handleFilterReset,
  handleFilterApply,
  filterOpen,
  setFilterOpen
}: FacilityFiltersProps) {
  return (
    <>
      {/* Desktop Filter Dropdown */}
      <div className="hidden lg:flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filters</span>
              {(selectedTypes.length > 0 || selectedLocations.length > 0) && (
                <Badge variant="secondary" className="ml-2">
                  {selectedTypes.length + selectedLocations.length}
                </Badge>
              )}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[220px]">
            <DropdownMenuLabel>Facility Type</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <ScrollArea className="h-[200px]">
              {["Assisted Living", "Memory Care", "Skilled Nursing", "Independent Living"].map((type) => (
                <DropdownMenuCheckboxItem
                  key={type}
                  checked={selectedTypes.includes(type as FacilityType)}
                  onCheckedChange={() => toggleTypeSelection(type as FacilityType)}
                >
                  {type}
                </DropdownMenuCheckboxItem>
              ))}
            </ScrollArea>

            <DropdownMenuLabel className="mt-2">Location</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <ScrollArea className="h-[200px]">
              {["San Francisco, CA", "Oakland, CA", "San Jose, CA", "Palo Alto, CA", "Los Angeles, CA"].map((location) => (
                <DropdownMenuCheckboxItem
                  key={location}
                  checked={selectedLocations.includes(location as Location)}
                  onCheckedChange={() => toggleLocationSelection(location as Location)}
                >
                  {location}
                </DropdownMenuCheckboxItem>
              ))}
            </ScrollArea>

            <div className="flex items-center justify-between pt-2 mt-2 border-t">
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={handleFilterReset}
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Reset
              </Button>
              <Button size="sm" className="text-xs" onClick={handleFilterApply}>
                Apply Filters
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Mobile Filter Dialog */}
      <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Filter Facilities</DialogTitle>
            <DialogDescription>
              Refine results by facility type and location.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Facility Type</h3>
              <div className="grid grid-cols-2 gap-2">
                {["Assisted Living", "Memory Care", "Skilled Nursing", "Independent Living"].map((type) => (
                  <Button
                    key={type}
                    variant={selectedTypes.includes(type as FacilityType) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleTypeSelection(type as FacilityType)}
                    className={selectedTypes.includes(type as FacilityType) ? "bg-healthcare-600" : ""}
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">Location</h3>
              <div className="grid grid-cols-1 gap-2">
                {["San Francisco, CA", "Oakland, CA", "San Jose, CA", "Palo Alto, CA", "Los Angeles, CA"].map((location) => (
                  <Button
                    key={location}
                    variant={selectedLocations.includes(location as Location) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleLocationSelection(location as Location)}
                    className={selectedLocations.includes(location as Location) ? "bg-healthcare-600" : ""}
                  >
                    {location}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={handleFilterReset}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button onClick={handleFilterApply} className="bg-healthcare-600">
                Apply Filters
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Active Filters Display */}
      {(selectedTypes.length > 0 || selectedLocations.length > 0) && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm font-medium">Active Filters:</span>
          {selectedTypes.map(type => (
            <Badge key={type} variant="secondary" className="flex items-center gap-1">
              {type}
              <button 
                onClick={() => toggleTypeSelection(type)}
                className="ml-1 rounded-full"
              >
                ×
              </button>
            </Badge>
          ))}
          {selectedLocations.map(location => (
            <Badge key={location} variant="secondary" className="flex items-center gap-1">
              <Globe className="h-3 w-3 mr-1" />
              {location}
              <button 
                onClick={() => toggleLocationSelection(location)}
                className="ml-1 rounded-full"
              >
                ×
              </button>
            </Badge>
          ))}
          <Button variant="ghost" size="sm" onClick={handleFilterReset} className="h-7 px-2">
            Clear All
          </Button>
        </div>
      )}
    </>
  );
}
