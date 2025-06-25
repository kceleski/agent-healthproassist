
import { useState, useEffect } from 'react';
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, ArrowLeft, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import GoogleMapsView from "@/components/maps/GoogleMapsView";

const AvaMapPage = () => {
  const [searchParams, setSearchParams] = useState<any>(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const params = sessionStorage.getItem('facilitySearchParams');
    if (params) {
      setSearchParams(JSON.parse(params));
      setHasSearched(true);
    }
  }, []);

  return (
    <div className="container py-6">
      <Helmet>
        <title>Ava Map Assistant - HealthProAssist</title>
        <meta name="description" content="Explore facilities with Ava, your AI-powered map assistant." />
      </Helmet>
      
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <MessageCircle className="h-6 w-6 text-blue-600" />
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Ava Map Assistant</h1>
          </div>
          <p className="text-muted-foreground mt-2">
            Explore facilities with AI-powered assistance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-blue-100 text-blue-700 px-3 py-1">
            AI Assistant
          </Badge>
          <Button asChild variant="outline" size="sm" className="gap-1">
            <Link to="/search">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to Search</span>
            </Link>
          </Button>
        </div>
      </div>

      {searchParams && (
        <Card className="mb-6 bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-2 items-center text-sm md:text-base">
              <span className="font-medium">Current Search:</span> 
              <span className="text-blue-700">{searchParams.location}</span>
              
              {searchParams.careType !== "any" && (
                <Badge variant="outline" className="bg-blue-100">
                  {searchParams.careType}
                </Badge>
              )}
              
              {searchParams.amenities && searchParams.amenities.length > 0 && (
                <Badge variant="outline" className="bg-blue-100">
                  {searchParams.amenities.length} amenities
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Interactive Facility Map
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <GoogleMapsView hasSearched={hasSearched} />
        </CardContent>
      </Card>
    </div>
  );
};

export default AvaMapPage;
