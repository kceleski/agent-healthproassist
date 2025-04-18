
import { useState, useRef, useEffect } from 'react';
import { useAuth } from "@/context/AuthContext";
import { toast } from 'sonner';
import { Helmet } from "react-helmet";
import { useAvaAssistant } from '@/hooks/use-ava-assistant';
import { useFacilityMap } from '@/hooks/use-facility-map';
import { AvaChatInterface } from '@/components/ava/AvaChatInterface';
import { AvaAvatar } from '@/components/ava/AvaAvatar';
import { AvaFacilityMap } from '@/components/ava/AvaFacilityMap';
import { animateResponse } from '@/services/did-service';

const AvaMapPage = () => {
  const { user } = useAuth();
  const isPro = (user?.demoTier || user?.subscription) === 'premium';
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [input, setInput] = useState('');
  const {
    messages,
    isLoading,
    sendMessage,
    createThread
  } = useAvaAssistant();

  const {
    mapRef,
    mapIsLoaded,
    setMapIsLoaded,
    activeFilter,
    activeLocation,
    initializeMap,
    applyMapFilters
  } = useFacilityMap(isPro);

  // Initialize Google Maps
  useEffect(() => {
    if (!isPro || !mapRef.current) return;
    
    if (!window.google?.maps) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places&callback=initMap`;
      script.async = true;
      script.defer = true;
      
      window.initMap = () => {
        initializeMap();
        setMapIsLoaded(true);
      };
      
      document.head.appendChild(script);
      
      return () => {
        window.initMap = undefined;
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };
    } else {
      initializeMap();
      setMapIsLoaded(true);
    }
  }, [isPro]);

  // Initialize assistant thread
  useEffect(() => {
    createThread();
  }, []);

  const processMapCommands = (text: string) => {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('assisted living')) {
      applyMapFilters('assisted-living', activeLocation);
    } else if (lowerText.includes('memory care')) {
      applyMapFilters('memory-care', activeLocation);
    } else if (lowerText.includes('skilled nursing')) {
      applyMapFilters('skilled-nursing', activeLocation);
    } else if (lowerText.includes('independent living')) {
      applyMapFilters('independent-living', activeLocation);
    } else if (lowerText.includes('show all facilities')) {
      applyMapFilters('all', activeLocation);
    }
    
    if (lowerText.includes('san francisco')) {
      applyMapFilters(activeFilter, 'san-francisco');
    } else if (lowerText.includes('oakland')) {
      applyMapFilters(activeFilter, 'oakland');
    } else if (lowerText.includes('san jose')) {
      applyMapFilters(activeFilter, 'san-jose');
    } else if (lowerText.includes('palo alto')) {
      applyMapFilters(activeFilter, 'palo-alto');
    } else if (lowerText.includes('los angeles')) {
      applyMapFilters(activeFilter, 'los-angeles');
    } else if (lowerText.includes('all locations')) {
      applyMapFilters(activeFilter, 'all');
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    try {
      const response = await sendMessage(input);
      setInput('');
      
      if (response) {
        processMapCommands(response);
        const resultUrl = await animateResponse(response);
        
        if (videoRef.current && resultUrl) {
          videoRef.current.src = resultUrl;
          videoRef.current.play();
        }
      }
    } catch (error) {
      console.error('Error in message handling:', error);
      toast.error('An error occurred while processing your message');
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-10 flex flex-col items-center bg-slate-50">
      <div className="container max-w-6xl flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ava Map Assistant</h1>
          <p className="text-muted-foreground">
            Chat with Ava to find and filter senior care facilities on the map.
            {!isPro && (
              <span className="ml-2 text-healthcare-600">
                Note: Basic tier has limited filtering options. <a href="/profile" className="underline">Upgrade to Pro</a> for advanced features.
              </span>
            )}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-1/2 flex flex-col gap-6">
            <AvaChatInterface
              messages={messages}
              isLoading={isLoading}
              input={input}
              setInput={setInput}
              onSendMessage={handleSendMessage}
            />

            <AvaAvatar
              isLoading={isLoading}
              videoRef={videoRef}
              hasMessages={messages.length > 0}
            />
          </div>

          <div className="w-full lg:w-1/2">
            <AvaFacilityMap
              isPro={isPro}
              mapRef={mapRef}
              activeFilter={activeFilter}
              activeLocation={activeLocation}
            />
          </div>
        </div>

        <div className="mt-4 bg-healthcare-50 p-4 rounded-lg">
          <h2 className="font-semibold mb-2">Try asking Ava:</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>"Show me assisted living facilities in San Francisco"</li>
            <li>"Where can I find memory care in Oakland?"</li>
            <li>"What skilled nursing options are available near Palo Alto?"</li>
            <li>"Show all facilities in Los Angeles"</li>
            <li>"Reset all filters and show everything"</li>
          </ul>
        </div>
      </div>

      {isPro && (
        <Helmet>
          <script>
            {`
              window.initMap = function() {};
            `}
          </script>
        </Helmet>
      )}
    </div>
  );
};

export default AvaMapPage;
