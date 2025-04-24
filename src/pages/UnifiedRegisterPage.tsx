
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import WelcomeTabs from "@/components/welcome/WelcomeTabs";
import { z } from "zod";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const UnifiedRegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    bio: "",
    default_location: "",
    notification_preferences: { email: true, sms: false, inApp: true },
    communication_preferences: {
      receiveUpdates: true,
      receiveReferrals: true,
      allowContactSharing: false
    }
  });

  // First step is to gather email and password, which we'll store but not register yet
  const [registrationStep, setRegistrationStep] = useState<'credentials' | 'details'>('credentials');
  
  const handleRegistrationInfoChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const proceedToDetails = () => {
    // Validate email and password first
    try {
      const schema = z.object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z.string().email("Please enter a valid email address"),
        password: z.string().min(8, "Password must be at least 8 characters"),
      });
      
      schema.parse({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      
      setRegistrationStep('details');
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach(err => {
          toast.error(err.message);
        });
      } else {
        console.error("Validation error:", error);
        toast.error("Please check your registration information");
      }
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNotificationChange = (field: "email" | "sms" | "inApp", value: boolean) => {
    setFormData(prev => ({
      ...prev,
      notification_preferences: {
        ...prev.notification_preferences,
        [field]: value
      }
    }));
  };

  const handleCommunicationPrefChange = (
    field: "receiveUpdates" | "receiveReferrals" | "allowContactSharing",
    value: boolean
  ) => {
    setFormData(prev => ({
      ...prev,
      communication_preferences: {
        ...prev.communication_preferences,
        [field]: value
      }
    }));
  };

  const savePreferences = async () => {
    try {
      setLoading(true);
      console.log("Starting registration process with data:", {
        name: formData.name,
        email: formData.email,
        profileData: {
          bio: formData.bio,
          default_location: formData.default_location,
          notification_preferences: formData.notification_preferences,
          communication_preferences: formData.communication_preferences
        }
      });
      
      // Now we actually register the user with Supabase
      await register(
        formData.name,
        formData.email, 
        formData.password,
        {
          bio: formData.bio,
          default_location: formData.default_location,
          notification_preferences: formData.notification_preferences,
          communication_preferences: formData.communication_preferences
        }
      );
      
      toast.success("Account created successfully!");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error during registration:", error);
      toast.error(error.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  if (registrationStep === 'credentials') {
    return (
      <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center">
        <div className="w-full max-w-md glass-card p-8 rounded-xl animate-zoom-in">
          <Link
            to="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to home
          </Link>

          <div className="mb-8">
            <h1 className="text-2xl font-bold">Create your account</h1>
            <p className="text-sm text-muted-foreground">
              Join HealthProAssist to streamline your senior care placements
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={formData.name}
                onChange={(e) => handleRegistrationInfoChange('name', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={formData.email}
                onChange={(e) => handleRegistrationInfoChange('email', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={formData.password}
                onChange={(e) => handleRegistrationInfoChange('password', e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Must be at least 8 characters
              </p>
            </div>
            
            <button
              onClick={proceedToDetails}
              className="w-full bg-healthcare-600 hover:bg-healthcare-700 text-white py-2 px-4 rounded-md transition-colors"
            >
              Next: Setup Your Account
            </button>
            
            <div className="text-center text-sm text-muted-foreground pt-4">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-healthcare-600 hover:text-healthcare-500"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If we've progressed past credentials, show the welcome flow
  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <Card className="border-none shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-t-lg">
          <CardTitle className="text-3xl">Complete Your Registration</CardTitle>
          <CardDescription className="text-white/90 text-lg">
            Let's set up your account to get the most out of HealthProAssist
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6">
          <WelcomeTabs 
            preferences={{
              notification_preferences: formData.notification_preferences,
              communication_preferences: formData.communication_preferences,
              bio: formData.bio,
              default_location: formData.default_location
            }}
            loading={loading}
            onInputChange={handleInputChange}
            onNotificationChange={handleNotificationChange}
            onCommunicationPrefChange={handleCommunicationPrefChange}
            onSave={savePreferences}
          />
        </CardContent>
        
        <CardFooter className="bg-gray-50 p-4 text-center text-sm text-muted-foreground rounded-b-lg">
          You can always update your preferences later in your profile settings.
        </CardFooter>
      </Card>
    </div>
  );
};

export default UnifiedRegisterPage;
