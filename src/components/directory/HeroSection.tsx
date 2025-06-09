
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Flag, Heart } from "lucide-react";

interface HeroSectionProps {
  onVeteranJourney: () => void;
  onGeneralJourney: () => void;
}

export const HeroSection = ({ onVeteranJourney, onGeneralJourney }: HeroSectionProps) => {
  return (
    <div className="relative bg-gradient-to-br from-healthcare-50 to-healthcare-100 py-16 px-4">
      <div className="container max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-healthcare-800 mb-4">
          Senior Care That Feels Like Home
        </h1>
        <p className="text-xl text-healthcare-600 mb-8 max-w-2xl mx-auto">
          Find the perfect care community for you or your loved one. 
          Our AI assistants are here to guide you every step of the way.
        </p>
        
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <Card className="hover:shadow-lg transition-all duration-200 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 bg-healthcare-100 rounded-full">
                  <Flag className="h-8 w-8 text-healthcare-600" />
                </div>
                <h3 className="text-xl font-semibold text-healthcare-800">
                  I'm a Veteran or Military Family
                </h3>
                <p className="text-healthcare-600 text-center">
                  Connect with Ranger, our specialized AI assistant who understands 
                  military benefits and veteran-specific care options.
                </p>
                <Button 
                  onClick={onVeteranJourney}
                  className="w-full bg-healthcare-600 hover:bg-healthcare-700"
                >
                  Start with Ranger
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-all duration-200 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 bg-healthcare-100 rounded-full">
                  <Heart className="h-8 w-8 text-healthcare-600" />
                </div>
                <h3 className="text-xl font-semibold text-healthcare-800">
                  I'm Exploring Care Options
                </h3>
                <p className="text-healthcare-600 text-center">
                  Meet Ava, our compassionate AI assistant who will help you 
                  navigate care options and find the right fit.
                </p>
                <Button 
                  onClick={onGeneralJourney}
                  className="w-full bg-healthcare-600 hover:bg-healthcare-700"
                >
                  Start with Ava
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
