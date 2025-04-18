
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface BioTabProps {
  bio: string;
  onBioChange: (value: string) => void;
  onBack: () => void;
  onContinue: () => void;
}

const BioTab = ({
  bio,
  onBioChange,
  onBack,
  onContinue
}: BioTabProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">About You</h2>
      <p>
        Tell us a bit about yourself and your work with clients. This information helps 
        personalize your experience and can be shared with healthcare facilities when making referrals.
      </p>
      
      <div className="space-y-2">
        <Label htmlFor="bio">Professional Bio</Label>
        <Textarea 
          id="bio" 
          placeholder="Share your background, expertise, and the types of clients you typically work with..." 
          value={bio}
          onChange={(e) => onBioChange(e.target.value)}
          className="min-h-[150px]"
        />
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

export default BioTab;
