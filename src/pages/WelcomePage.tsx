
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const WelcomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("welcome");
  const [progress, setProgress] = useState(0);
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

  const handleNotificationChange = (field: string, value: boolean) => {
    setPreferences((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, [field]: value },
    }));
  };

  const handleCommunicationPrefChange = (field: string, value: boolean) => {
    setPreferences((prev) => ({
      ...prev,
      communicationPreferences: { ...prev.communicationPreferences, [field]: value },
    }));
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    
    // Update progress based on tab
    switch(tab) {
      case "welcome": setProgress(0); break;
      case "location": setProgress(25); break;
      case "notifications": setProgress(50); break;
      case "bio": setProgress(75); break;
      case "finish": setProgress(100); break;
    }
  };

  const savePreferences = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Save preferences to Supabase
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: user.id,
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
      
      // Navigate to dashboard after successful setup
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
          <Progress value={progress} className="h-2 mt-4 bg-white/20" />
        </CardHeader>
        
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="welcome">Welcome</TabsTrigger>
            <TabsTrigger value="location">Location</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="bio">Your Bio</TabsTrigger>
            <TabsTrigger value="finish">Finish</TabsTrigger>
          </TabsList>
          
          <TabsContent value="welcome" className="p-6">
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
                <Button onClick={() => handleTabChange("location")}>
                  Let's Get Started
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="location" className="p-6">
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
                  value={preferences.defaultLocation}
                  onChange={(e) => handleInputChange("defaultLocation", e.target.value)}
                  className="w-full"
                />
                <p className="text-sm text-muted-foreground">
                  This location will be used as the default for facility searches.
                </p>
              </div>
              
              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => handleTabChange("welcome")}>
                  Back
                </Button>
                <Button onClick={() => handleTabChange("notifications")}>
                  Continue
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="notifications" className="p-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Notification Preferences</h2>
              <p>
                Choose how you'd like to receive updates and communications from HealthProAssist.
                You can update these preferences anytime in your profile settings.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications" className="font-medium">
                      Email Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receive updates and alerts via email
                    </p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={preferences.notifications.email}
                    onCheckedChange={(checked) => handleNotificationChange("email", checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sms-notifications" className="font-medium">
                      SMS Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receive updates and alerts via text message
                    </p>
                  </div>
                  <Switch 
                    id="sms-notifications"
                    checked={preferences.notifications.sms}
                    onCheckedChange={(checked) => handleNotificationChange("sms", checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="inapp-notifications" className="font-medium">
                      In-App Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receive updates and alerts within the application
                    </p>
                  </div>
                  <Switch 
                    id="inapp-notifications"
                    checked={preferences.notifications.inApp}
                    onCheckedChange={(checked) => handleNotificationChange("inApp", checked)}
                  />
                </div>
              </div>
              
              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => handleTabChange("location")}>
                  Back
                </Button>
                <Button onClick={() => handleTabChange("bio")}>
                  Continue
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="bio" className="p-6">
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
                  value={preferences.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  className="min-h-[150px]"
                />
              </div>
              
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="receive-updates" className="font-medium">
                      Receive Healthcare Updates
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Get industry news and healthcare facility updates
                    </p>
                  </div>
                  <Switch 
                    id="receive-updates"
                    checked={preferences.communicationPreferences.receiveUpdates}
                    onCheckedChange={(checked) => handleCommunicationPrefChange("receiveUpdates", checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="receive-referrals" className="font-medium">
                      Receive Referral Opportunities
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Allow facilities to contact you about potential client referrals
                    </p>
                  </div>
                  <Switch 
                    id="receive-referrals"
                    checked={preferences.communicationPreferences.receiveReferrals}
                    onCheckedChange={(checked) => handleCommunicationPrefChange("receiveReferrals", checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="share-contacts" className="font-medium">
                      Contact Sharing
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Allow sharing your contact info with healthcare facilities
                    </p>
                  </div>
                  <Switch 
                    id="share-contacts"
                    checked={preferences.communicationPreferences.allowContactSharing}
                    onCheckedChange={(checked) => handleCommunicationPrefChange("allowContactSharing", checked)}
                  />
                </div>
              </div>
              
              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => handleTabChange("notifications")}>
                  Back
                </Button>
                <Button onClick={() => handleTabChange("finish")}>
                  Continue
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="finish" className="p-6">
            <div className="space-y-4 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h2 className="text-2xl font-semibold">You're All Set!</h2>
              <p>
                Thank you for setting up your preferences. You're now ready to use HealthProAssist
                to its full potential. Your settings have been saved and you can change them anytime
                from your profile page.
              </p>
              
              <div className="bg-blue-50 p-4 rounded-md border border-blue-100 text-left">
                <h3 className="font-medium text-blue-800">Next Steps:</h3>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-blue-700">
                  <li>Explore healthcare facilities in your area</li>
                  <li>Add your first client to manage their care needs</li>
                  <li>Set up calendar integrations for appointment tracking</li>
                  <li>Try out our AI assistant for healthcare recommendations</li>
                </ul>
              </div>
              
              <div className="pt-6">
                <Button 
                  onClick={savePreferences}
                  disabled={loading}
                  className="px-8"
                >
                  {loading ? "Saving..." : "Get Started"}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <CardFooter className="bg-gray-50 p-4 text-center text-sm text-muted-foreground rounded-b-lg">
          You can always access this setup guide again from your profile settings.
        </CardFooter>
      </Card>
    </div>
  );
};

export default WelcomePage;
