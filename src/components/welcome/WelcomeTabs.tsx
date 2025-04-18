
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WelcomeTab from "./tabs/WelcomeTab";
import LocationTab from "./tabs/LocationTab";
import NotificationsTab from "./tabs/NotificationsTab";
import BioTab from "./tabs/BioTab";
import FinishTab from "./tabs/FinishTab";
import { Progress } from "@/components/ui/progress";

type PreferencesType = {
  defaultLocation: string;
  notifications: {
    email: boolean;
    sms: boolean;
    inApp: boolean;
  };
  bio: string;
  communicationPreferences: {
    receiveUpdates: boolean;
    receiveReferrals: boolean;
    allowContactSharing: boolean;
  };
};

interface WelcomeTabsProps {
  preferences: PreferencesType;
  loading: boolean;
  onInputChange: (field: string, value: string) => void;
  onNotificationChange: (field: "email" | "sms" | "inApp", value: boolean) => void;
  onCommunicationPrefChange: (field: "receiveUpdates" | "receiveReferrals" | "allowContactSharing", value: boolean) => void;
  onSave: () => void;
}

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

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <Progress value={progress} className="h-2 mt-4 bg-white/20" />
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="welcome">Welcome</TabsTrigger>
        <TabsTrigger value="location">Location</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="bio">Your Bio</TabsTrigger>
        <TabsTrigger value="finish">Finish</TabsTrigger>
      </TabsList>
      
      <TabsContent value="welcome">
        <WelcomeTab onContinue={() => handleTabChange("location")} />
      </TabsContent>
      
      <TabsContent value="location">
        <LocationTab 
          defaultLocation={preferences.defaultLocation}
          onLocationChange={(value) => onInputChange("defaultLocation", value)}
          onBack={() => handleTabChange("welcome")}
          onContinue={() => handleTabChange("notifications")}
        />
      </TabsContent>
      
      <TabsContent value="notifications">
        <NotificationsTab 
          notifications={preferences.notifications}
          communicationPreferences={preferences.communicationPreferences}
          onNotificationChange={onNotificationChange}
          onCommunicationPrefChange={onCommunicationPrefChange}
          onBack={() => handleTabChange("location")}
          onContinue={() => handleTabChange("bio")}
        />
      </TabsContent>
      
      <TabsContent value="bio">
        <BioTab 
          bio={preferences.bio}
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
        />
      </TabsContent>
    </Tabs>
  );
};

export default WelcomeTabs;
