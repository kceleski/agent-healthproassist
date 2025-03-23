import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle, ArrowRight, Building, Contact, DollarSign, Search, ShieldCheck, UserCheck } from "lucide-react";
import { useState } from "react";

const LandingPage = () => {
  const [activeTab, setActiveTab] = useState<'monthly' | 'annual'>('monthly');

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

          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10 pointer-events-none h-20 bottom-0" />
            <div className="glass-card rounded-xl overflow-hidden shadow-xl animate-zoom-in max-w-5xl mx-auto">
              <img 
                src="https://images.unsplash.com/photo-1573497161161-c3e73707e25c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                alt="Healthcare professional meeting with elderly client's family" 
                className="w-full h-auto"
              />
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

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-healthcare-50">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Have Questions?</h2>
            <p className="text-muted-foreground">
              Our team is here to help. Reach out to us with any questions about HealthProAssist.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="glass-card p-8 rounded-xl text-center">
              <div className="w-12 h-12 rounded-full bg-healthcare-100 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-healthcare-600">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </div>
              <h3 className="font-medium mb-2">Call Us</h3>
              <p className="text-muted-foreground">(800) 555-1234</p>
            </div>
            
            <div className="glass-card p-8 rounded-xl text-center">
              <div className="w-12 h-12 rounded-full bg-healthcare-100 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-healthcare-600">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <h3 className="font-medium mb-2">Email Us</h3>
              <p className="text-muted-foreground">contact@healthproassist.com</p>
            </div>
            
            <div className="glass-card p-8 rounded-xl text-center">
              <div className="w-12 h-12 rounded-full bg-healthcare-100 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-healthcare-600">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <h3 className="font-medium mb-2">Visit Us</h3>
              <p className="text-muted-foreground">123 Health Avenue, Suite 400<br />San Francisco, CA 94107</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
