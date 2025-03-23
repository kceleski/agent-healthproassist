import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  CheckCircle, 
  ArrowRight, 
  Building, 
  Contact, 
  DollarSign, 
  Search, 
  ShieldCheck, 
  UserCheck, 
  Users, 
  Home, 
  Heart, 
  Star, 
  ArrowUpRight, 
  Calendar, 
  FileText,
  Sparkles,
  CreditCard,
  UserPlus
} from "lucide-react";
import { useState, useEffect } from "react";

const LandingPage = () => {
  const [activeTab, setActiveTab] = useState<'monthly' | 'annual'>('monthly');
  const [animationStarted, setAnimationStarted] = useState(false);

  // Start animations when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationStarted(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      icon: <Building className="w-10 h-10 text-healthcare-500" />,
      title: "Facility Directory",
      description: "Access a comprehensive database of senior living facilities with detailed information on services, amenities, and care types."
    },
    {
      icon: <Contact className="w-10 h-10 text-healthcare-500" />,
      title: "Contact Management",
      description: "Organize and manage facility contacts and senior clients all in one place for efficient communication."
    },
    {
      icon: <DollarSign className="w-10 h-10 text-healthcare-500" />,
      title: "Payment Tracking",
      description: "Keep track of commissions, fees, and payments with an intuitive financial management system."
    },
    {
      icon: <Search className="w-10 h-10 text-healthcare-500" />,
      title: "Advanced Search",
      description: "Find the perfect facility match for your clients with powerful filtering and search capabilities."
    },
    {
      icon: <ShieldCheck className="w-10 h-10 text-healthcare-500" />,
      title: "Secure Platform",
      description: "Your data is protected with enterprise-grade security and compliance with healthcare privacy standards."
    },
    {
      icon: <UserCheck className="w-10 h-10 text-healthcare-500" />,
      title: "Client Matching",
      description: "Match your senior clients with appropriate facilities based on their needs, preferences, and budget."
    }
  ];

  const plans = [
    {
      name: "Free",
      description: "Basic access for new agents",
      monthlyPrice: 0,
      annualPrice: 0,
      features: [
        "Limited facility directory access",
        "Basic contact management",
        "10 placements per month",
        "Email support"
      ],
      cta: "Start Free",
      popular: false
    },
    {
      name: "Basic",
      description: "For growing placement agencies",
      monthlyPrice: 49,
      annualPrice: 470,
      features: [
        "Full facility directory access",
        "Advanced contact management",
        "50 placements per month",
        "Payment tracking",
        "Priority email support"
      ],
      cta: "Get Started",
      popular: true
    },
    {
      name: "Premium",
      description: "For established agencies",
      monthlyPrice: 99,
      annualPrice: 950,
      features: [
        "Unlimited facility access",
        "Advanced contact management",
        "Unlimited placements",
        "Advanced analytics",
        "White-label reports",
        "24/7 phone support"
      ],
      cta: "Get Premium",
      popular: false
    }
  ];

  const testimonials = [
    {
      quote: "HealthProAssist completely transformed how I manage my senior placement business. The facility directory alone saved me countless hours of research.",
      author: "Sarah Johnson",
      title: "Senior Placement Advisor",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80"
    },
    {
      quote: "The payment tracking feature is a game-changer. I now have complete visibility into my commissions and never miss a payment.",
      author: "David Martinez",
      title: "Elder Care Consultant",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80"
    },
    {
      quote: "As someone who works with dozens of facilities, having all my contacts in one secure place has made my job infinitely easier.",
      author: "Michelle Wong",
      title: "Senior Living Advisor",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80"
    }
  ];

  // Generate random positions for sparkles
  const generateSparkles = (count: number) => {
    const sparkles = [];
    for (let i = 0; i < count; i++) {
      sparkles.push({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        delay: Math.random() * 5
      });
    }
    return sparkles;
  };

  const sparkles = generateSparkles(20);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-healthcare-50 to-white pointer-events-none" />
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="animate-fade-in">
              <div className="inline-block bg-healthcare-100 text-healthcare-700 px-3 py-1 rounded-full text-sm font-medium mb-6">
                The Platform for Healthcare Placement Professionals
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
                Streamline Senior Care Placement With Confidence
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                HealthProAssist empowers placement agents with a comprehensive database of senior living facilities and powerful tools to manage contacts, track payments, and grow your business.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="text-md">
                  <Link to="/register">Get Started Today</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-md">
                  <Link to="/#features" className="group flex items-center gap-2">
                    Explore Features 
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-16 relative max-w-6xl mx-auto">
            <div className="glass-card rounded-xl p-4 md:p-8 shadow-xl overflow-hidden bg-white/90 animate-zoom-in">
              {/* Interactive Animated Healthcare Placement Scene */}
              <div className="health-placement-scene">
                <div className="scene-background"></div>
                
                {/* Sparkles throughout the scene */}
                {sparkles.map((sparkle) => (
                  <div 
                    key={sparkle.id}
                    className="sparkle"
                    style={{
                      left: sparkle.left,
                      top: sparkle.top,
                      animationDelay: `${sparkle.delay}s`
                    }}
                  ></div>
                ))}

                {/* Agent Section - Left Side */}
                <div className={`animated-placement-element ${animationStarted ? 'pop-in' : 'opacity-0'}`} 
                    style={{left: '10%', bottom: '25%', animationDelay: '0.3s'}}>
                  
                  {/* Background pulse effect for agent */}
                  <div className="burst-circle bg-healthcare-200" style={{width: '150px', height: '150px', left: '-35px', top: '-35px'}}></div>
                  
                  {/* Agent character */}
                  <div className="relative">
                    <div className="bg-white p-3 rounded-full shadow-lg mb-3 floating">
                      <div className="bg-healthcare-600 p-3 rounded-full">
                        <Users className="w-10 h-10 text-white" />
                      </div>
                      
                      {/* Badge with notification */}
                      <div className="absolute top-0 right-0">
                        <div className="bg-healthcare-100 p-1 rounded-full">
                          <CheckCircle className="w-5 h-5 text-healthcare-600" />
                        </div>
                        <div className="notification-ring" style={{left: '50%', top: '50%'}}></div>
                      </div>
                    </div>
                    
                    {/* Agent device showing app */}
                    <div className="relative floating-delay-2">
                      <div className="bg-white rounded-lg shadow-lg p-2 border border-healthcare-100 max-w-[150px]">
                        <div className="bg-healthcare-50 rounded-md p-1 mb-2">
                          <div className="flex items-center justify-between">
                            <div className="w-4 h-4 rounded-full bg-healthcare-500"></div>
                            <div className="w-10 h-1 bg-healthcare-200 rounded-full"></div>
                          </div>
                        </div>
                        <div className="space-y-1 mb-1">
                          <div className="w-full h-2 bg-healthcare-100 rounded-full"></div>
                          <div className="w-3/4 h-2 bg-healthcare-100 rounded-full"></div>
                        </div>
                        <div className="flex justify-between">
                          <div className="w-5 h-5 bg-healthcare-200 rounded-md flex items-center justify-center">
                            <Search className="w-3 h-3 text-healthcare-500" />
                          </div>
                          <div className="w-5 h-5 bg-healthcare-200 rounded-md flex items-center justify-center">
                            <Users className="w-3 h-3 text-healthcare-500" />
                          </div>
                          <div className="w-5 h-5 bg-healthcare-200 rounded-md flex items-center justify-center relative">
                            <DollarSign className="w-3 h-3 text-healthcare-500" />
                            <div className="notification-badge">3</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Agent speech bubble */}
                    <div className="absolute top-8 right-[-110px] floating-delay-1">
                      <div className="bg-white rounded-lg px-3 py-2 shadow-md border border-healthcare-100">
                        <p className="text-sm">Finding you the <span className="text-healthcare-600 font-medium">perfect match!</span></p>
                      </div>
                      <div className="w-3 h-3 bg-white border-l border-b border-healthcare-100 absolute -left-1 top-3 transform rotate-45"></div>
                    </div>
                  </div>
                </div>

                {/* Warm Leads Feature - Top */}
                <div className={`animated-placement-element ${animationStarted ? 'pop-in' : 'opacity-0'}`} 
                    style={{left: '50%', top: '5%', transform: 'translateX(-50%)', zIndex: 20, animationDelay: '0.5s'}}>
                  <div className="bg-healthcare-600 text-white px-4 py-3 rounded-xl shadow-lg floating-delay-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles className="w-5 h-5 text-yellow-300" />
                      <h3 className="font-bold">Warm Leads System</h3>
                    </div>
                    <p className="text-sm opacity-90 mb-2">Qualified prospects delivered straight to your dashboard</p>
                    <div className="flex items-center gap-2 bg-white/20 rounded-lg p-2">
                      <UserPlus className="w-5 h-5 text-healthcare-100" />
                      <div className="text-xs">
                        <div className="font-medium">New lead from <span className="text-yellow-300">San Francisco, CA</span></div>
                        <div className="opacity-80">Memory care needed • High budget • Urgent</div>
                      </div>
                      <ArrowUpRight className="w-4 h-4 ml-auto" />
                    </div>
                  </div>
                  <div className="h-24 w-2 bg-gradient-to-b from-healthcare-600 to-transparent mx-auto"></div>
                </div>

                {/* Family Group - Right Side */}
                <div className={`animated-placement-element ${animationStarted ? 'pop-in' : 'opacity-0'}`} 
                    style={{right: '10%', bottom: '25%', animationDelay: '0.6s'}}>
                  
                  {/* Background pulse effect for family */}
                  <div className="burst-circle bg-healthcare-100" style={{width: '180px', height: '180px', left: '-50px', top: '-30px'}}></div>
                  
                  {/* Family group characters */}
                  <div className="relative">
                    <div className="flex items-end space-x-2 mb-3">
                      <div className="bg-white p-2 rounded-full shadow-lg floating-delay-1">
                        <div className="bg-healthcare-400 p-2 rounded-full">
                          <Users className="w-7 h-7 text-white" />
                        </div>
                      </div>
                      <div className="bg-white p-3 rounded-full shadow-lg floating-delay-3 relative">
                        <div className="bg-healthcare-300 p-2 rounded-full">
                          <Users className="w-8 h-8 text-white" />
                        </div>
                        <div className="absolute -top-1 -right-1">
                          <Heart className="w-6 h-6 text-healthcare-500 fill-healthcare-500" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Family speech bubble */}
                    <div className="absolute top-6 left-[-140px] floating-delay-2">
                      <div className="bg-white rounded-lg px-3 py-2 shadow-md border border-healthcare-100">
                        <p className="text-sm">We need <span className="text-healthcare-600 font-medium">compassionate care</span> for Mom.</p>
                      </div>
                      <div className="w-3 h-3 bg-white border-r border-b border-healthcare-100 absolute -right-1 top-3 transform rotate-45"></div>
                    </div>
                    
                    {/* Family checklist */}
                    <div className="bg-white rounded-lg shadow-lg p-2 border border-healthcare-100 max-w-[160px] floating-delay-4">
                      <div className="text-xs font-semibold text-healthcare-700 mb-1 flex items-center">
                        <FileText className="w-3 h-3 mr-1" />
                        Care Preferences
                      </div>
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-healthcare-500" />
                          <span>Memory Care</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-healthcare-500" />
                          <span>Skilled Nursing</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-healthcare-500" />
                          <span>Near Family</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-healthcare-500" />
                          <span>Activities</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Facility Cluster - Top */}
                <div className={`animated-placement-element ${animationStarted ? 'pop-in' : 'opacity-0'}`} 
                    style={{right: '20%', top: '15%', zIndex: 5, animationDelay: '0.8s'}}>
                  <div className="flex flex-col items-center floating-delay-1">
                    <div className="bg-white p-2 rounded-full shadow-lg">
                      <div className="bg-healthcare-100 p-1 rounded-full">
                        <Building className="w-8 h-8 text-healthcare-700" />
                      </div>
                    </div>
                    <div className="text-xs font-medium mt-1 bg-healthcare-50 px-2 py-1 rounded-full text-healthcare-700">
                      Willow Springs
                    </div>
                  </div>
                </div>

                <div className={`animated-placement-element ${animationStarted ? 'pop-in' : 'opacity-0'}`} 
                    style={{right: '30%', top: '5%', zIndex: 5, animationDelay: '0.9s'}}>
                  <div className="flex flex-col items-center floating-delay-2">
                    <div className="bg-white p-2 rounded-full shadow-lg">
                      <div className="bg-healthcare-100 p-1 rounded-full">
                        <Home className="w-6 h-6 text-healthcare-600" />
                      </div>
                    </div>
                    <div className="text-xs font-medium mt-1 bg-healthcare-50 px-2 py-1 rounded-full text-healthcare-700">
                      Evergreen
                    </div>
                  </div>
                </div>

                <div className={`animated-placement-element ${animationStarted ? 'pop-in' : 'opacity-0'}`} 
                    style={{right: '10%', top: '12%', zIndex: 5, animationDelay: '1s'}}>
                  <div className="flex flex-col items-center floating-delay-3">
                    <div className="bg-white p-2 rounded-full shadow-lg relative">
                      <div className="bg-healthcare-100 p-1 rounded-full">
                        <Building className="w-7 h-7 text-healthcare-600" />
                      </div>
                      <div className="absolute -top-1 -right-1">
                        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      </div>
                    </div>
                    <div className="text-xs font-medium mt-1 bg-healthcare-50 px-2 py-1 rounded-full text-healthcare-700">
                      Golden Oaks
                    </div>
                  </div>
                </div>

                {/* Matching Process - Center */}
                <div className={`animated-placement-element ${animationStarted ? 'pop-in' : 'opacity-0'}`} 
                    style={{left: '50%', top: '50%', transform: 'translate(-50%, -50%)', zIndex: 15, animationDelay: '1.2s'}}>
                  <div className="flex flex-col items-center justify-center">
                    {/* Connection hub */}
                    <div className="relative">
                      <div className="bg-healthcare-100 p-4 rounded-full shadow-lg pulsing">
                        <div className="bg-healthcare-600 p-3 rounded-full relative spinning">
                          <Users className="w-10 h-10 text-white" />
                          <div className="absolute inset-0 rounded-full border-4 border-white border-dashed"></div>
                        </div>
                      </div>
                      
                      {/* Calendar/Appointments */}
                      <div className="absolute -right-16 -top-16 floating-delay-1">
                        <div className="bg-white rounded-lg p-2 shadow-md border border-healthcare-100">
                          <div className="flex items-center gap-1 text-xs font-medium text-healthcare-700 mb-1">
                            <Calendar className="w-3 h-3" />
                            <span>Tour</span>
                          </div>
                          <div className="text-[10px]">Tomorrow, 2PM</div>
                          <div className="text-[10px] text-healthcare-600">Golden Oaks</div>
                        </div>
                      </div>
                      
                      {/* Payment/Commission */}
                      <div className="absolute -left-20 -bottom-14 floating-delay-2">
                        <div className="bg-white rounded-lg p-2 shadow-md border border-healthcare-100">
                          <div className="flex items-center gap-1 text-xs font-medium text-healthcare-700 mb-1">
                            <CreditCard className="w-3 h-3" />
                            <span>Commission</span>
                          </div>
                          <div className="text-xs font-bold text-healthcare-600">$2,400</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Connector lines to characters */}
                    <div className="absolute" style={{left: '-120px', top: '50%', width: '120px', height: '2px'}}>
                      <div className="connector w-full">
                        <div className="connector-dot"></div>
                      </div>
                    </div>
                    
                    <div className="absolute" style={{right: '-120px', top: '50%', width: '120px', height: '2px'}}>
                      <div className="connector w-full">
                        <div className="connector-dot"></div>
                      </div>
                    </div>
                    
                    <div className="absolute" style={{left: '50%', top: '-100px', height: '100px', width: '2px'}}>
                      <div className="connector-vertical h-full">
                        <div className="connector-dot-vertical"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Successful Placement Result - Bottom */}
                <div className={`animated-placement-element ${animationStarted ? 'pop-in' : 'opacity-0'}`} 
                    style={{left: '50%', bottom: '5%', transform: 'translateX(-50%)', zIndex: 25, animationDelay: '1.5s'}}>
                  <div className="bg-white rounded-xl shadow-lg border border-healthcare-100 p-3 max-w-xs mx-auto text-center bouncing">
                    <div className="bg-healthcare-50 p-2 rounded-lg mb-2">
                      <div className="text-healthcare-700 font-medium">Successful Placement!</div>
                      <div className="text-xs text-healthcare-600">Mrs. Johnson → Golden Oaks</div>
                    </div>
                    <div className="flex justify-around">
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground">Family</div>
                        <div className="text-healthcare-600 font-medium">Happy</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground">Facility</div>
                        <div className="text-healthcare-600 font-medium">Perfect Fit</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground">Agent</div>
                        <div className="text-healthcare-600 font-medium">Paid</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-8 rounded-xl text-center">
              <div className="text-4xl font-bold text-healthcare-600 mb-2">500+</div>
              <p className="text-muted-foreground">Senior Living Facilities</p>
            </div>
            <div className="glass-card p-8 rounded-xl text-center">
              <div className="text-4xl font-bold text-healthcare-600 mb-2">2,500+</div>
              <p className="text-muted-foreground">Successful Placements</p>
            </div>
            <div className="glass-card p-8 rounded-xl text-center">
              <div className="text-4xl font-bold text-healthcare-600 mb-2">98%</div>
              <p className="text-muted-foreground">Client Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-b from-white to-healthcare-50">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Powerful Features for Placement Professionals</h2>
            <p className="text-muted-foreground">Our comprehensive platform streamlines every aspect of senior care placement, saving you time and helping you provide better service.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="glass-card p-8 rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Trusted by Placement Professionals</h2>
            <p className="text-muted-foreground">Don't just take our word for it. Here's what our users have to say about HealthProAssist.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="glass-card p-8 rounded-xl">
                <div className="mb-6">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.667 13.333V18.667H16.0003V24.0003H5.33366V13.333H10.667Z" fill="#0ea5e9" />
                    <path d="M26.6667 13.333V18.667H21.333V24.0003H32.0003V13.333H26.6667Z" fill="#0ea5e9" />
                  </svg>
                </div>
                <p className="text-muted-foreground mb-6">{testimonial.quote}</p>
                <div className="flex items-center">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.author} 
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <div className="font-medium">{testimonial.author}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.title}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-healthcare-50">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-muted-foreground mb-8">Choose the plan that's right for your business needs.</p>
            
            <div className="inline-flex items-center bg-white p-1 rounded-full border mb-8">
              <button
                onClick={() => setActiveTab('monthly')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === 'monthly'
                    ? 'bg-healthcare-600 text-white'
                    : 'bg-transparent text-muted-foreground'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setActiveTab('annual')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === 'annual'
                    ? 'bg-healthcare-600 text-white'
                    : 'bg-transparent text-muted-foreground'
                }`}
              >
                Annual (Save 20%)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`bg-white rounded-xl overflow-hidden transition-all duration-300 ${
                  plan.popular
                    ? 'ring-2 ring-healthcare-500 shadow-xl scale-105 md:scale-110'
                    : 'border shadow-soft hover:shadow-md'
                }`}
              >
                {plan.popular && (
                  <div className="bg-healthcare-500 text-white text-center py-2 text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-muted-foreground mb-4">{plan.description}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">
                      ${activeTab === 'monthly' ? plan.monthlyPrice : plan.annualPrice}
                    </span>
                    <span className="text-muted-foreground">
                      {plan.monthlyPrice > 0 ? `/${activeTab === 'monthly' ? 'month' : 'year'}` : ''}
                    </span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-healthcare-500 mr-2 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    asChild
                    variant={plan.popular ? 'default' : 'outline'}
                    className={`w-full ${plan.popular ? 'bg-healthcare-600 hover:bg-healthcare-700' : ''}`}
                  >
                    <Link to="/register">{plan.cta}</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="glass-card bg-gradient-to-r from-healthcare-600 to-healthcare-800 text-white rounded-xl p-12 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">Ready to transform your placement business?</h2>
                <p className="mb-0 text-healthcare-100">
                  Join thousands of placement professionals who trust HealthProAssist to grow their business.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-end">
                <Button asChild size="lg" className="bg-white text-healthcare-800 hover:bg-healthcare-50 text-md">
                  <Link to="/register">Get Started</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-white border-white hover:bg-white/10 text-md">
                  <Link to="/login">Sign In</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
