
import { Button } from "@/components/ui/button";

interface FinishTabProps {
  loading: boolean;
  onBack: () => void;
  onSave: () => void;
  onCancel: () => void;
}

const FinishTab = ({
  loading,
  onBack,
  onSave,
  onCancel
}: FinishTabProps) => {
  return (
    <div className="space-y-4 text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      
      <h2 className="text-2xl font-semibold">You're All Set!</h2>
      <p>
        Thank you for setting up your preferences. You're now ready to use HealthProAssist
        to its full potential. Your settings have been saved and you can update them anytime
        from your profile settings.
      </p>
      
      <div className="flex justify-between pt-4 gap-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            onClick={onSave}
            disabled={loading}
            className="px-8"
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FinishTab;
