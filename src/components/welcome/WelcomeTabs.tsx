
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WelcomeTab from "./tabs/WelcomeTab";
import LocationTab from "./tabs/LocationTab";
import NotificationsTab from "./tabs/NotificationsTab";
import BioTab from "./tabs/BioTab";
import FinishTab from "./tabs/FinishTab";
import { Progress } from "@/components/ui/progress";
import { WelcomeTabsProps } from "@/types/profile";

const WelcomeTabs = ({
  preferences,
  loading,
  onInputChange,
  onNotificationChange,
  onCommunicationPrefChange,
  onSave
}: WelcomeTabsProps) => {
  const [activeTab, setActiveTab] = useState("welcome");
  const [progress, setProgress] = useState(0);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    
    switch(tab) {
      case "welcome": setProgress(0); break;
      case "location": setProgress(25); break;
      case "notifications": setProgress(50); break;
      case "bio": setProgress(75); break;
      case "finish": setProgress(100); break;
    }
  };

  const handleCancel = () => {
    // Navigate back to dashboard
    window.location.href = "/dashboard";
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <Progress value={progress} className="h-2 mt-4 bg-white/20" />
      <TabsList className="grid w-full grid-cols-5 gap-1 mb-4">
        <TabsTrigger value="welcome" className="text-xs sm:text-sm">Welcome</TabsTrigger>
        <TabsTrigger value="location" className="text-xs sm:text-sm">Location</TabsTrigger>
        <TabsTrigger value="notifications" className="text-xs sm:text-sm">Notifications</TabsTrigger>
        <TabsTrigger value="bio" className="text-xs sm:text-sm">Your Bio</TabsTrigger>
        <TabsTrigger value="finish" className="text-xs sm:text-sm">Finish</TabsTrigger>
      </TabsList>
      
      <TabsContent value="welcome">
        <WelcomeTab onContinue={() => handleTabChange("location")} />
      </TabsContent>
      
      <TabsContent value="location">
        <LocationTab 
          defaultLocation={preferences.default_location || ""}
          onLocationChange={(value) => onInputChange("default_location", value)}
          onBack={() => handleTabChange("welcome")}
          onContinue={() => handleTabChange("notifications")}
        />
      </TabsContent>
      
      <TabsContent value="notifications">
        <NotificationsTab 
          notifications={preferences.notification_preferences}
          communicationPreferences={preferences.communication_preferences}
          onNotificationChange={onNotificationChange}
          onCommunicationPrefChange={onCommunicationPrefChange}
          onBack={() => handleTabChange("location")}
          onContinue={() => handleTabChange("bio")}
        />
      </TabsContent>
      
      <TabsContent value="bio">
        <BioTab 
          bio={preferences.bio || ""}
          onBioChange={(value) => onInputChange("bio", value)}
          onBack={() => handleTabChange("notifications")}
          onContinue={() => handleTabChange("finish")}
        />
      </TabsContent>
      
      <TabsContent value="finish">
        <FinishTab 
          loading={loading}
          onBack={() => handleTabChange("bio")}
          onSave={onSave}
          onCancel={handleCancel}
        />
      </TabsContent>
    </Tabs>
  );
};

export default WelcomeTabs;
