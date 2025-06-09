
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bot, Flag, Heart } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export const WelcomeAssistantPanel = () => {
  const { user } = useAuth();
  
  // Check if user has veteran tags (placeholder logic)
  const isVeteran = user?.email?.includes('veteran') || false;
  
  const handleLaunchAssistant = (type: 'ava' | 'ranger') => {
    // TODO: Launch appropriate AI assistant
    console.log(`Launching ${type} assistant`);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          Your AI Assistant
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isVeteran ? (
          <div className="flex items-center gap-4 p-4 bg-healthcare-50 rounded-lg">
            <div className="p-3 bg-healthcare-100 rounded-full">
              <Flag className="h-6 w-6 text-healthcare-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-healthcare-800">Meet Ranger</h3>
              <p className="text-sm text-healthcare-600">
                Your specialized AI assistant for veteran benefits and military family care options.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Badge variant="secondary">Veteran</Badge>
              <Button size="sm" onClick={() => handleLaunchAssistant('ranger')}>
                Chat with Ranger
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4 p-4 bg-healthcare-50 rounded-lg">
            <div className="p-3 bg-healthcare-100 rounded-full">
              <Heart className="h-6 w-6 text-healthcare-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-healthcare-800">Meet Ava</h3>
              <p className="text-sm text-healthcare-600">
                Your compassionate AI assistant to help navigate care options and find the right fit.
              </p>
            </div>
            <Button size="sm" onClick={() => handleLaunchAssistant('ava')}>
              Chat with Ava
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
