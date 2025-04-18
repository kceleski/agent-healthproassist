
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LocationTabProps {
  defaultLocation: string;
  onLocationChange: (value: string) => void;
  onBack: () => void;
  onContinue: () => void;
}

const LocationTab = ({
  defaultLocation,
  onLocationChange,
  onBack,
  onContinue
}: LocationTabProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Set Your Default Location</h2>
      <p>
        Setting your default location helps us show you the most relevant healthcare 
        facilities in your area. You can always change this later or search in other locations.
      </p>
      
      <div className="space-y-2">
        <Label htmlFor="defaultLocation">Default City/Zip Code</Label>
        <Input 
          id="defaultLocation" 
          placeholder="e.g., Phoenix, AZ or 85001" 
          value={defaultLocation}
          onChange={(e) => onLocationChange(e.target.value)}
          className="w-full"
        />
        <p className="text-sm text-muted-foreground">
          This location will be used as the default for facility searches.
        </p>
      </div>
      
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onContinue}>
          Continue
        </Button>
      </div>
    </div>
  );
};

export default LocationTab;
