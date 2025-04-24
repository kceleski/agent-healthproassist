
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import WelcomeTabs from "@/components/welcome/WelcomeTabs";
import { useUserProfile } from "@/hooks/useUserProfile";
import { UserProfile } from "@/types/profile";
import { toast } from "sonner";

const WelcomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, updateProfile, isLoading } = useUserProfile(user?.id);
  
  const handleInputChange = (field: string, value: string) => {
    if (!profile) return;
    updateProfile({ ...profile, [field]: value });
  };

  const handleNotificationChange = (field: "email" | "sms" | "inApp", value: boolean) => {
    if (!profile) return;
    
    updateProfile({
      ...profile,
      notification_preferences: {
        ...profile.notification_preferences,
        [field]: value
      }
    });
  };

  const handleCommunicationPrefChange = (
    field: "receiveUpdates" | "receiveReferrals" | "allowContactSharing",
    value: boolean
  ) => {
    if (!profile) return;
    
    updateProfile({
      ...profile,
      communication_preferences: {
        ...profile.communication_preferences,
        [field]: value
      }
    });
  };

  const savePreferences = async () => {
    try {
      await updateProfile(profile as UserProfile);
      toast.success("Preferences saved successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast.error("Failed to save preferences. Please try again.");
    }
  };
  
  // Create a preferences object that matches what WelcomeTabs expects
  const preferences = profile || {
    notification_preferences: { email: true, sms: false, inApp: true },
    communication_preferences: {
      receiveUpdates: true,
      receiveReferrals: true,
      allowContactSharing: false
    },
    bio: "",
    default_location: ""
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
            loading={isLoading}
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
