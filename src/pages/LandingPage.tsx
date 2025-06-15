
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Users, Search, Building, DollarSign, Star } from "lucide-react";
import { useState } from "react";

// Placeholder for future images
const heroImg =
  "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=900&q=80";

const features = [
  {
    icon: <Search className="w-7 h-7 text-healthcare-500" />,
    title: "Advanced Facility Search",
    description: "Powerful filters help you match clients with ideal care communities."
  },
  {
    icon: <Building className="w-7 h-7 text-healthcare-500" />,
    title: "Comprehensive Directory",
    description: "Explore 500+ detailed listings and connect instantly."
  },
  {
    icon: <Users className="w-7 h-7 text-healthcare-500" />,
    title: "Contact Management",
    description: "Keep track of clients, facilities, and families—all in one place."
  },
  {
    icon: <DollarSign className="w-7 h-7 text-healthcare-500" />,
    title: "Payment Tracking",
    description: "Visualize commissions and fees, and stay on top of every invoice."
  },
  {
    icon: <Star className="w-7 h-7 text-healthcare-500" />,
    title: "Client Matching Engine",
    description: "AI-powered recommendations tailored to your business."
  },
];

const testimonials = [
  {
    quote: "HealthProAssist has streamlined my workflow beyond belief—client matches are now a breeze.",
    author: "Sarah Johnson",
    title: "Placement Advisor",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64&q=80"
  },
  {
    quote: "Transparent pricing and fantastic support. My agency doubled placement speed.",
    author: "David Martinez",
    title: "Elder Care Consultant",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=64&q=80"
  }
];

const plans = [
  {
    name: "Basic",
    price: "49",
    period: "mo",
    desc: "Perfect for independent advisors",
    features: [
      "Facility directory access",
      "Client management",
      "Calendar integration",
      "Basic support",
    ],
    cta: "Get Started",
    popular: false
  },
  {
    name: "Pro",
    price: "250",
    period: "mo",
    desc: "For growing agencies & teams",
    features: [
      "Unlimited access",
      "Advanced analytics",
      "Commission tools",
      "Priority support",
      "Free updates"
    ],
    cta: "Start 14-Day Trial",
    popular: true
  },
];

const LandingPage = () => {
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");

  return (
    <div className="w-full font-sans">
      {/* HERO */}
      <div className="bg-gradient-to-b from-healthcare-50 to-white min-h-[60vh] flex flex-col md:flex-row items-center justify-between px-6 sm:px-12 pt-16 md:pt-28 pb-16 gap-10 md:gap-0">
        <div className="max-w-xl md:w-1/2 text-center md:text-left mx-auto md:mx-0">
          <span className="inline-block px-3 py-1 rounded-full bg-healthcare-100 text-healthcare-700 text-xs font-semibold mb-4 tracking-wide">
            Built for Placement Pros
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4 leading-tight text-healthcare-800">
            Modern Senior Care Placement, <span className="text-healthcare-600">Reimagined</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8">
            Grow your agency with HealthProAssist—AI-powered facility search, client tools, and payments in one secure platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Button asChild size="lg" className="bg-healthcare-600 hover:bg-healthcare-700 w-full sm:w-auto">
              <Link to="/register">Get Started Free</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-healthcare-300 text-healthcare-800 w-full sm:w-auto">
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        </div>
        <div className="flex-1 hidden md:flex items-center justify-center">
          <img
            src={heroImg}
            alt="Care placement workflow"
            className="rounded-xl shadow-2xl w-full max-w-md object-cover border-4 border-white"
            style={{ maxHeight: 380 }}
          />
        </div>
      </div>

      {/* FEATURES */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-3xl font-bold mb-2 text-healthcare-800">Why HealthProAssist?</h2>
          <p className="text-center text-md text-muted-foreground mb-10 max-w-2xl mx-auto">
            Everything you need for faster, smarter, and more human-centered senior care placements.
          </p>
          <div className="grid gap-8 md:grid-cols-3 lg:grid-cols-5">
            {features.map((f, i) => (
              <div key={i} className="flex flex-col items-center p-6 bg-healthcare-50 border border-healthcare-100 rounded-xl shadow-sm hover:shadow-md transition-all">
                <div className="mb-3">{f.icon}</div>
                <h3 className="text-lg font-medium text-healthcare-600 mb-1">{f.title}</h3>
                <p className="text-xs text-muted-foreground text-center">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-12 bg-gradient-to-b from-white to-healthcare-50">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-2xl font-bold mb-6 text-healthcare-800">Loved by Professionals</h2>
          <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md p-6 max-w-md border mx-auto text-center">
                <p className="italic text-md text-healthcare-700 mb-4">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center justify-center gap-3 mt-4">
                  <img src={t.image} alt={t.author} className="h-11 w-11 rounded-full object-cover border-2 border-healthcare-100" />
                  <div className="text-left">
                    <div className="font-semibold">{t.author}</div>
                    <div className="text-xs text-muted-foreground">{t.title}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="py-16 bg-healthcare-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-6 text-healthcare-800">Simple, All-Inclusive Pricing</h2>
          <div className="flex justify-center mb-8">
            <div className="inline-flex rounded-full border bg-white p-1 overflow-hidden">
              <button
                onClick={() => setBilling("monthly")}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
                  billing === "monthly"
                    ? "bg-healthcare-600 text-white"
                    : "bg-transparent text-healthcare-700"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBilling("annual")}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
                  billing === "annual"
                    ? "bg-healthcare-600 text-white"
                    : "bg-transparent text-healthcare-700"
                }`}
              >
                Annual <span className="ml-1 text-xs text-healthcare-500">(Save 20%)</span>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {plans.map((plan, i) => (
              <div
                key={i}
                className={`bg-white rounded-2xl shadow-xl relative p-8 flex flex-col items-center border-2 ${
                  plan.popular
                    ? "border-healthcare-500 scale-105 z-10"
                    : "border-healthcare-200"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-healthcare-500 text-white text-xs px-4 py-1 rounded-full font-bold tracking-wide shadow">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-4 text-muted-foreground">{plan.desc}</div>
                <div className="text-4xl font-extrabold text-healthcare-700 mb-3">
                  ${billing === "monthly" ? plan.price : Math.round(Number(plan.price) * (12 * 0.8))}
                  <span className="text-base font-medium text-muted-foreground">/{billing === "monthly" ? "mo" : "yr"}</span>
                </div>
                <ul className="mb-8 mt-2 space-y-3 w-full text-left">
                  {plan.features.map((feature, i2) => (
                    <li key={i2} className="flex items-center gap-2 text-healthcare-700 text-sm">
                      <span className="rounded-full bg-healthcare-50 p-1 mr-1">
                        <Star className="w-4 h-4 text-healthcare-600" />
                      </span>{" "}
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button asChild size="lg" className="w-full mt-auto bg-healthcare-600 hover:bg-healthcare-700">
                  <Link to="/register">{plan.cta}</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-3xl px-4 bg-gradient-to-r from-healthcare-600 to-healthcare-700 rounded-xl shadow-2xl p-10 text-center text-white">
          <h2 className="text-3xl font-bold mb-3">Ready for a better placement experience?</h2>
          <p className="mb-6 text-md">
            Start your free trial or sign in to revolutionize the way you place senior clients!
          </p>
          <Button asChild size="lg" className="bg-white text-healthcare-800 hover:bg-healthcare-50">
            <Link to="/register">Get Started</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
