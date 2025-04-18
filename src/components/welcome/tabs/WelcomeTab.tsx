
import { Button } from "@/components/ui/button";

interface WelcomeTabProps {
  onContinue: () => void;
}

const WelcomeTab = ({ onContinue }: WelcomeTabProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Welcome to HealthProAssist!</h2>
      <p>
        HealthProAssist is your AI-powered health assistant that helps you find, compare, 
        and manage healthcare facilities for your clients. Our platform streamlines the process 
        of researching and recommending care options.
      </p>
      
      <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
        <h3 className="font-medium text-blue-800">Key Features:</h3>
        <ul className="list-disc pl-5 mt-2 space-y-1 text-blue-700">
          <li>Search and filter healthcare facilities</li>
          <li>Interactive map view with facility details</li>
          <li>Client management and record keeping</li>
          <li>Calendar and appointment scheduling</li>
          <li>AI assistant to answer healthcare questions</li>
        </ul>
      </div>
      
      <p>
        Let's take a few minutes to set up your account preferences.
        This will help us personalize your experience and ensure you get the most 
        out of HealthProAssist.
      </p>
      
      <div className="pt-4">
        <Button onClick={onContinue}>
          Let's Get Started
        </Button>
      </div>
    </div>
  );
};

export default WelcomeTab;
