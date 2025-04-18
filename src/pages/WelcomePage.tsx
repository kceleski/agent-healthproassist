
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import WelcomeTabs from "@/components/welcome/WelcomeTabs";

type NotificationPreferences = {
  email: boolean;
  sms: boolean;
  inApp: boolean;
};

type CommunicationPreferences = {
  receiveUpdates: boolean;
  receiveReferrals: boolean;
  allowContactSharing: boolean;
};

const WelcomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [preferences, setPreferences] = useState({
    defaultLocation: "",
    notifications: {
      email: true,
      sms: false,
      inApp: true,
    },
    bio: "",
    communicationPreferences: {
      receiveUpdates: true,
      receiveReferrals: true,
      allowContactSharing: false,
    }
  });

  const handleInputChange = (field: string, value: string) => {
    setPreferences((prev) => ({ ...prev, [field]: value }));
  };

  const handleNotificationChange = (field: keyof NotificationPreferences, value: boolean) => {
    setPreferences((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, [field]: value },
    }));
  };

  const handleCommunicationPrefChange = (field: keyof CommunicationPreferences, value: boolean) => {
    setPreferences((prev) => ({
      ...prev,
      communicationPreferences: { ...prev.communicationPreferences, [field]: value },
    }));
  };

  const savePreferences = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          default_location: preferences.defaultLocation,
          bio: preferences.bio,
          notification_preferences: preferences.notifications,
          communication_preferences: preferences.communicationPreferences
        });
      
      if (error) throw error;
      
      toast({
        title: "Setup Complete!",
        description: "Your preferences have been saved successfully.",
      });
      
      navigate("/dashboard");
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast({
        title: "Error Saving Preferences",
        description: "There was a problem saving your preferences. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <Card className="border-none shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-t-lg">
          <CardTitle className="text-3xl">Welcome to HealthProAssist</CardTitle>
          <CardDescription className="text-white/90 text-lg">
            Let's set up your account to get the most out of your AI health assistant
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6">
          <WelcomeTabs 
            preferences={preferences}
            loading={loading}
            onInputChange={handleInputChange}
            onNotificationChange={handleNotificationChange}
            onCommunicationPrefChange={handleCommunicationPrefChange}
            onSave={savePreferences}
          />
        </CardContent>
        
        <CardFooter className="bg-gray-50 p-4 text-center text-sm text-muted-foreground rounded-b-lg">
          You can always access this setup guide again from your profile settings.
        </CardFooter>
      </Card>
    </div>
  );
};

export default WelcomePage;
