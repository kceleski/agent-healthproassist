
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { z } from "zod";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";

const UnifiedRegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<'standard' | 'premium'>('standard');
  const [step, setStep] = useState(1);
  const totalSteps = 5;
  const progress = Math.round((step / totalSteps) * 100);
  
  const [formData, setFormData] = useState({
    // Basic info
    name: "",
    email: "",
    password: "",
    phone: "",
    
    // Professional info
    workType: "independent" as 'agency' | 'independent', // Fix: explicitly type as union type
    agencyName: "",
    agencyAddress: "",
    agencyPhone: "",
    agencyWebsite: "",
    
    // Location & Experience
    serviceLocations: "",
    yearsExperience: "",
    specializations: "",
    
    // Profile
    headline: "",
    bio: "",
    profileImage: null as File | null,
    
    // Preferences
    notification_preferences: { email: true, sms: false, inApp: true },
    communication_preferences: {
      receiveUpdates: true,
      receiveReferrals: true,
      allowContactSharing: false
    }
  });

  const validateCurrentStep = () => {
    try {
      switch (step) {
        case 1: {
          // Basic info validation
          const schema = z.object({
            name: z.string().min(2, "Name must be at least 2 characters"),
            email: z.string().email("Please enter a valid email address"),
            password: z.string().min(8, "Password must be at least 8 characters"),
            phone: z.string().min(10, "Please enter a valid phone number"),
          });
          
          schema.parse({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            phone: formData.phone
          });
          break;
        }
        case 2: {
          // Professional info validation
          const schema = z.object({
            workType: z.enum(["agency", "independent"]),
            serviceLocations: z.string().min(2, "Please specify service locations")
          }).and(
            z.union([
              z.object({
                workType: z.literal("independent"),
              }),
              z.object({
                workType: z.literal("agency"),
                agencyName: z.string().min(2, "Agency name is required")
              })
            ])
          );
          
          schema.parse(formData);
          break;
        }
        case 3: {
          // Profile validation
          const schema = z.object({
            headline: z.string().min(5, "Headline must be at least 5 characters"),
            bio: z.string().min(20, "Bio should be at least 20 characters"),
          });
          
          schema.parse({
            headline: formData.headline,
            bio: formData.bio,
          });
          break;
        }
        case 4: {
          // Terms validation
          if (!agreeToTerms) {
            throw new Error("You must agree to the terms and conditions");
          }
          break;
        }
      }
      
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach(err => {
          toast.error(err.message);
        });
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        console.error("Validation error:", error);
        toast.error("Please check your information");
      }
      return false;
    }
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setStep(prev => Math.max(1, prev - 1));
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Profile image must be less than 5MB");
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error("File must be an image");
        return;
      }
      
      setFormData(prev => ({ ...prev, profileImage: file }));
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async () => {
    try {
      if (!validateCurrentStep()) return;
      
      setLoading(true);
      console.log("Starting registration process with data:", formData);
      
      // Create the metadata object for registration
      const metadata = {
        name: formData.name,
        bio: formData.bio,
        default_location: formData.serviceLocations,
        notification_preferences: formData.notification_preferences,
        communication_preferences: formData.communication_preferences,
        company: formData.workType === 'agency' ? formData.agencyName : undefined,
        job_title: "Placement Specialist",
        headline: formData.headline,
        years_experience: formData.yearsExperience,
        phone: formData.phone,
        specializations: formData.specializations,
        work_type: formData.workType,
        agency_details: formData.workType === 'agency' ? {
          name: formData.agencyName,
          address: formData.agencyAddress,
          phone: formData.agencyPhone,
          website: formData.agencyWebsite
        } : undefined,
        subscription_tier: selectedSubscription,
        profile_image: formData.profileImage ? 'pending_upload' : undefined
      };
      
      // Register the user with Supabase - pass email, password, and metadata as separate arguments
      await register(formData.email, formData.password, metadata);
      
      toast.success("Account created successfully!");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error during registration:", error);
      toast.error(error.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Basic Information</h2>
            <p className="text-muted-foreground">Let's get started with your account details</p>
            
            <div className="space-y-3">
              <div>
                <label htmlFor="name" className="text-sm font-medium">
                  Full Name
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              </div>
              
              <div>
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  By providing your email, you acknowledge it's your responsibility to ensure it is secure and HIPAA compliant.
                </p>
              </div>
              
              <div>
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a secure password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="text-sm font-medium">
                  Phone Number
                </label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(123) 456-7890"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  For clients to contact you directly
                </p>
              </div>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Professional Information</h2>
            <p className="text-muted-foreground">Tell us about your professional practice</p>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">
                  Do you work for an agency or independently?
                </label>
                <div className="flex space-x-4 mt-2">
                  <Button 
                    type="button"
                    variant={formData.workType === "agency" ? "default" : "outline"}
                    onClick={() => handleInputChange('workType', 'agency')}
                  >
                    Agency
                  </Button>
                  <Button 
                    type="button"
                    variant={formData.workType === "independent" ? "default" : "outline"}
                    onClick={() => handleInputChange('workType', 'independent')}
                  >
                    Independent
                  </Button>
                </div>
              </div>
              
              {formData.workType === "agency" && (
                <div className="space-y-3">
                  <div>
                    <label htmlFor="agencyName" className="text-sm font-medium">
                      Agency Name
                    </label>
                    <Input
                      id="agencyName"
                      type="text"
                      placeholder="Agency name"
                      value={formData.agencyName}
                      onChange={(e) => handleInputChange('agencyName', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="agencyAddress" className="text-sm font-medium">
                      Agency Address
                    </label>
                    <Input
                      id="agencyAddress"
                      type="text"
                      placeholder="123 Main St, City, State ZIP"
                      value={formData.agencyAddress}
                      onChange={(e) => handleInputChange('agencyAddress', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="agencyPhone" className="text-sm font-medium">
                      Agency Phone
                    </label>
                    <Input
                      id="agencyPhone"
                      type="tel"
                      placeholder="(123) 456-7890"
                      value={formData.agencyPhone}
                      onChange={(e) => handleInputChange('agencyPhone', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="agencyWebsite" className="text-sm font-medium">
                      Agency Website
                    </label>
                    <Input
                      id="agencyWebsite"
                      type="text"
                      placeholder="www.example.com"
                      value={formData.agencyWebsite}
                      onChange={(e) => handleInputChange('agencyWebsite', e.target.value)}
                    />
                  </div>
                </div>
              )}
              
              <div>
                <label htmlFor="serviceLocations" className="text-sm font-medium">
                  Service Locations
                </label>
                <Input
                  id="serviceLocations"
                  type="text"
                  placeholder="Cities or regions you serve"
                  value={formData.serviceLocations}
                  onChange={(e) => handleInputChange('serviceLocations', e.target.value)}
                />
              </div>
              
              <div>
                <label htmlFor="yearsExperience" className="text-sm font-medium">
                  Years in Industry
                </label>
                <Input
                  id="yearsExperience"
                  type="text"
                  placeholder="e.g., 5+"
                  value={formData.yearsExperience}
                  onChange={(e) => handleInputChange('yearsExperience', e.target.value)}
                />
              </div>
              
              <div>
                <label htmlFor="specializations" className="text-sm font-medium">
                  Specializations or Expertise
                </label>
                <Input
                  id="specializations"
                  type="text"
                  placeholder="e.g., Memory Care, Assisted Living"
                  value={formData.specializations}
                  onChange={(e) => handleInputChange('specializations', e.target.value)}
                />
              </div>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Your Profile</h2>
            <p className="text-muted-foreground">Create your public profile to showcase your expertise</p>
            
            <div className="space-y-3">
              <div>
                <label htmlFor="headline" className="text-sm font-medium">
                  Headline Quote
                </label>
                <Input
                  id="headline"
                  type="text"
                  placeholder="A brief slogan or quote for your profile"
                  value={formData.headline}
                  onChange={(e) => handleInputChange('headline', e.target.value)}
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  This will be displayed prominently on your agent page
                </p>
              </div>
              
              <div>
                <label htmlFor="bio" className="text-sm font-medium">
                  Professional Bio
                </label>
                <Textarea
                  id="bio"
                  placeholder="Tell clients about your approach and experience"
                  className="min-h-[120px]"
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium block mb-2">
                  Profile Photo
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <div className="flex items-center space-x-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={triggerFileInput}
                  >
                    <Upload className="w-4 h-4 mr-2" /> Choose Photo
                  </Button>
                  {formData.profileImage && (
                    <span className="text-sm text-green-600">
                      <Check className="w-4 h-4 inline mr-1" />
                      {formData.profileImage.name}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Recommended: Professional headshot, max 5MB
                </p>
              </div>
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Service Terms</h2>
            <p className="text-muted-foreground">Please review and agree to our terms of service</p>
            
            <div className="bg-gray-50 p-4 rounded-md border text-sm h-64 overflow-y-auto">
              <h3 className="font-semibold mb-2">Terms & Conditions for HealthProAssist Platform Use</h3>
              <p className="mb-2">By agreeing to these terms, you acknowledge and confirm that:</p>
              
              <ol className="list-decimal pl-5 space-y-2">
                <li>You possess the necessary knowledge, skills, experience, and qualifications to act as a senior placement specialist.</li>
                <li>You will maintain the confidentiality of all client information in accordance with HIPAA and applicable privacy laws.</li>
                <li>You will use the HealthProAssist platform responsibly and ethically to provide accurate and helpful guidance to seniors and their families.</li>
                <li>You understand that HealthProAssist provides tools to assist your practice, but you remain solely responsible for your professional recommendations and decisions.</li>
                <li>You will not use the platform to engage in any illegal, fraudulent, or harmful activities.</li>
                <li>You agree to hold HealthProAssist harmless from any claims arising from your use of the platform or your interactions with clients.</li>
                <li>You understand that all client data entered through the platform must be handled according to privacy best practices and applicable laws.</li>
                <li>You agree to keep your login credentials secure and not share your account with others.</li>
              </ol>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="terms" 
                checked={agreeToTerms}
                onCheckedChange={(checked) => setAgreeToTerms(checked === true)}
              />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I agree to the terms and conditions as a professional placement specialist
              </label>
            </div>
          </div>
        );
        
      case 5:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Choose Your Subscription</h2>
            <p className="text-muted-foreground">Select the plan that works best for you</p>
            
            <div className="grid gap-4 pt-4">
              <div 
                className={`border rounded-lg p-4 cursor-pointer ${selectedSubscription === 'standard' ? 'border-blue-500 bg-blue-50' : ''}`}
                onClick={() => setSelectedSubscription('standard')}
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">Standard</h3>
                  <span className="text-blue-600 font-medium">$29/month</span>
                </div>
                <ul className="mt-2 space-y-1 text-sm">
                  <li>• Full facility database access</li>
                  <li>• Client management tools</li>
                  <li>• Basic AI assistance</li>
                  <li>• Up to 25 client placements per month</li>
                </ul>
              </div>
              
              <div 
                className={`border rounded-lg p-4 cursor-pointer ${selectedSubscription === 'premium' ? 'border-blue-500 bg-blue-50' : ''}`}
                onClick={() => setSelectedSubscription('premium')}
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">Premium</h3>
                  <span className="text-blue-600 font-medium">$49/month</span>
                </div>
                <div className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mt-1">
                  14-day free trial
                </div>
                <ul className="mt-2 space-y-1 text-sm">
                  <li>• All Standard features</li>
                  <li>• Advanced AI lead generation</li>
                  <li>• Premium placement in agent directory</li>
                  <li>• Custom branded client portal</li>
                  <li>• Unlimited client placements</li>
                  <li>• Priority support</li>
                </ul>
              </div>
            </div>
            
            <p className="text-xs text-muted-foreground">
              All plans include a 14-day premium trial. You can change your plan at any time.
            </p>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pt-10 pb-12 flex flex-col items-center justify-center">
      <div className="w-full max-w-3xl glass-card p-6 lg:p-8 rounded-xl animate-zoom-in">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to home
        </Link>

        <div className="mb-6">
          <h1 className="text-2xl font-bold">Join HealthProAssist</h1>
          <p className="text-sm text-muted-foreground">
            Create your account to start streamlining your senior care placements
          </p>
        </div>

        <div className="mb-6">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>Step {step} of {totalSteps}</span>
            <span>{progress}% Complete</span>
          </div>
        </div>

        <div className="mt-4 mb-8">
          {renderStepContent()}
        </div>

        <div className="flex justify-between mt-8">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={step === 1 || loading}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          
          {step < totalSteps ? (
            <Button 
              onClick={handleNext}
              disabled={loading}
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit}
              disabled={loading || !agreeToTerms}
            >
              {loading ? "Creating Account..." : "Complete Registration"}
            </Button>
          )}
        </div>
        
        <div className="text-center text-sm text-muted-foreground pt-6">
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
  );
};

export default UnifiedRegisterPage;
