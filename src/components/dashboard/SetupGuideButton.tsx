
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const SetupGuideButton = () => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button asChild variant="outline" className="gap-2">
            <Link to="/welcome">
              <Settings size={18} />
              <span>Setup Guide</span>
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Configure your account preferences</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SetupGuideButton;
