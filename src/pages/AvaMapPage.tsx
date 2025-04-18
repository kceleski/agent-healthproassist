
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Loader2, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Helmet } from "react-helmet";

// Import the Google Maps types
import type {} from '@/types/google-maps';

// API keys
const OPENAI_API_KEY = "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";
const DID_API_KEY = "Z29vZ2xlLW9hdXRoMnwxMDczMTY2OTQxNDk2MjA5NTE1NzI6VHRmVE13cXBSQWk4eU5qTHpLT1J4";
const ASSISTANT_ID = "asst_83MVmU8KUWFD8zsJOIVjh9i2";
const GOOGLE_MAPS_API_KEY = "AIzaSyADFSlLS5ofwKFSwjQKE1LSAzO3kECr4Ho";
const GOOGLE_PLACES_API_KEY = "AIzaSyCxAU5BCCcICK4HdmkLfEDSQB3EvBwQQbE";

// Map filter types
type FilterType = 'assisted-living' | 'memory-care' | 'skilled-nursing' | 'independent-living' | 'all';
type LocationArea = 'san-francisco' | 'oakland' | 'san-jose' | 'palo-alto' | 'los-angeles' | 'all';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const AvaMapPage = () => {
  const { user } = useAuth();
  const isPro = (user?.demoTier || user?.subscription) === 'premium';
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  // Assistant thread management
  const [threadId, setThreadId] = useState<string | null>(localStorage.getItem('assistant_thread_id'));
  
  // Map filter state
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [activeLocation, setActiveLocation] = useState<LocationArea>('all');
  const [mapIsLoaded, setMapIsLoaded] = useState(false);
  
  // Create a new thread if we don't have one
  useEffect(() => {
    const createThread = async () => {
      if (!threadId) {
        try {
          console.log("Creating new thread with OpenAI Assistants v2 API");
          const response = await fetch('https://api.openai.com/v1/threads', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${OPENAI_API_KEY}`,
              'OpenAI-Beta': 'assistants=v2'  // Updated to v2
            },
            body: JSON.stringify({})
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            console.error('Thread creation response:', errorData);
            throw new Error(`Failed to create thread: ${errorData.error?.message || 'Unknown error'}`);
          }
          
          const data = await response.json();
          setThreadId(data.id);
          localStorage.setItem('assistant_thread_id', data.id);
        } catch (error) {
          console.error('Error creating thread:', error);
          toast.error('Failed to create OpenAI thread');
        }
      }
    };
    
    createThread();
  }, [threadId]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize Google Maps
  useEffect(() => {
    if (!isPro || !mapRef.current) return;
    
    // Load Google Maps API
    if (!window.google?.maps) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=initMap`;
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
      // API already loaded
      initializeMap();
      setMapIsLoaded(true);
    }
  }, [isPro]);

  // Initialize the map
  const initializeMap = () => {
    if (!mapRef.current || !isPro) return;
    
    try {
      // Create new map instance
      const mapOptions = {
        center: { lat: 37.7749, lng: -122.4194 }, // Default: San Francisco
        zoom: 11,
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: true
      };
      
      const map = new google.maps.Map(mapRef.current, mapOptions);
      mapInstanceRef.current = map;
      
      // Initialize with some facilities
      loadDefaultFacilities(map);
    } catch (error) {
      console.error('Error initializing Google Map:', error);
      toast.error('Could not initialize the map. Please try again.');
    }
  };

  // Load some default senior care facilities
  const loadDefaultFacilities = (map: google.maps.Map) => {
    if (!isPro) return;
    
    try {
      const service = new google.maps.places.PlacesService(map);
      
      service.nearbySearch(
        {
          location: { lat: 37.7749, lng: -122.4194 }, // San Francisco
          radius: 10000,
          keyword: 'senior care',
          type: 'health'
        },
        (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            // Clear any existing markers
            clearMarkers();
            
            // Create new markers
            const newMarkers: google.maps.Marker[] = [];
            const bounds = new google.maps.LatLngBounds();
            
            results.forEach(place => {
              if (!place.geometry || !place.geometry.location) return;
              
              const marker = new google.maps.Marker({
                position: place.geometry.location,
                map,
                title: place.name,
                animation: google.maps.Animation.DROP
              });
              
              const infoWindow = new google.maps.InfoWindow({
                content: `
                  <div>
                    <h3 style="font-weight: bold; margin-bottom: 5px;">${place.name}</h3>
                    <div style="margin-bottom: 5px;">${place.vicinity || ''}</div>
                    <div style="display: flex; align-items: center; margin-bottom: 5px;">
                      <span style="color: #FFC107; margin-right: 5px;">★</span>
                      <span>${place.rating || 'No rating'}</span>
                    </div>
                  </div>
                `
              });
              
              marker.addListener('click', () => {
                infoWindow.open(map, marker);
              });
              
              bounds.extend(place.geometry.location);
              newMarkers.push(marker);
            });
            
            // Store markers reference
            markersRef.current = newMarkers;
            
            // Adjust map to show all markers
            if (newMarkers.length > 0) {
              map.fitBounds(bounds);
            }
          } else {
            console.warn('Places search returned no results:', status);
          }
        }
      );
    } catch (error) {
      console.error('Error loading facilities:', error);
    }
  };
  
  // Clear all markers from the map
  const clearMarkers = () => {
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];
  };

  // Apply map filters
  const applyMapFilters = (filterType: FilterType, location: LocationArea) => {
    if (!mapIsLoaded || !mapInstanceRef.current) {
      console.warn('Google Maps not initialized');
      return;
    }
    
    try {
      // Construct search query
      let searchKeyword = 'senior care';
      let locationQuery = '';
      
      // Set facility type filter
      switch(filterType) {
        case 'assisted-living':
          searchKeyword = 'assisted living senior care';
          break;
        case 'memory-care':
          searchKeyword = 'memory care senior facility';
          break;
        case 'skilled-nursing':
          searchKeyword = 'skilled nursing facility';
          break;
        case 'independent-living':
          searchKeyword = 'independent living senior';
          break;
        case 'all':
          searchKeyword = 'senior care';
          break;
      }
      
      // Set location filter
      switch(location) {
        case 'san-francisco':
          locationQuery = 'San Francisco, CA';
          break;
        case 'oakland':
          locationQuery = 'Oakland, CA';
          break;
        case 'san-jose':
          locationQuery = 'San Jose, CA';
          break;
        case 'palo-alto':
          locationQuery = 'Palo Alto, CA';
          break;
        case 'los-angeles':
          locationQuery = 'Los Angeles, CA';
          break;
        case 'all':
          // Use current map center
          break;
      }
      
      // Store the new filter settings
      setActiveFilter(filterType);
      setActiveLocation(location);
      
      // Perform search with the combined filters
      performMapSearch(searchKeyword, locationQuery);
    } catch (error) {
      console.error('Error applying map filters:', error);
      toast.error('Failed to update map filters');
    }
  };
  
  // Perform a search on the map
  const performMapSearch = (keyword: string, location: string) => {
    if (!mapInstanceRef.current) return;
    
    const map = mapInstanceRef.current;
    clearMarkers();
    
    if (location) {
      // First geocode the location
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: location }, (results, status) => {
        if (status === "OK" && results && results.length > 0) {
          const locationCoords = results[0].geometry.location;
          map.setCenter(locationCoords);
          
          // Now search for places
          const service = new google.maps.places.PlacesService(map);
          service.nearbySearch(
            {
              location: locationCoords,
              radius: 10000,
              keyword: keyword,
              type: 'health'
            },
            (results, status) => {
              if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                // Create markers
                const newMarkers: google.maps.Marker[] = [];
                const bounds = new google.maps.LatLngBounds();
                
                results.forEach(place => {
                  if (!place.geometry || !place.geometry.location) return;
                  
                  const marker = new google.maps.Marker({
                    position: place.geometry.location,
                    map,
                    title: place.name,
                    animation: google.maps.Animation.DROP
                  });
                  
                  const infoWindow = new google.maps.InfoWindow({
                    content: `
                      <div>
                        <h3 style="font-weight: bold; margin-bottom: 5px;">${place.name}</h3>
                        <div style="margin-bottom: 5px;">${place.vicinity || ''}</div>
                        <div style="display: flex; align-items: center; margin-bottom: 5px;">
                          <span style="color: #FFC107; margin-right: 5px;">★</span>
                          <span>${place.rating || 'No rating'}</span>
                        </div>
                      </div>
                    `
                  });
                  
                  marker.addListener('click', () => {
                    infoWindow.open(map, marker);
                  });
                  
                  bounds.extend(place.geometry.location);
                  newMarkers.push(marker);
                });
                
                // Store markers reference
                markersRef.current = newMarkers;
                
                // Adjust map to show all markers
                if (newMarkers.length > 0) {
                  map.fitBounds(bounds);
                }
              } else {
                console.warn('Places search returned no results:', status);
              }
            }
          );
        } else {
          console.error('Geocoding failed:', status);
        }
      });
    } else {
      // Just search using the keyword around the current map center
      const service = new google.maps.places.PlacesService(map);
      const center = map.getCenter();
      
      if (center) {
        service.nearbySearch(
          {
            location: center,
            radius: 10000,
            keyword: keyword,
            type: 'health'
          },
          (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results) {
              // Create markers (same code as above)
              const newMarkers: google.maps.Marker[] = [];
              const bounds = new google.maps.LatLngBounds();
              
              results.forEach(place => {
                if (!place.geometry || !place.geometry.location) return;
                
                const marker = new google.maps.Marker({
                  position: place.geometry.location,
                  map,
                  title: place.name,
                  animation: google.maps.Animation.DROP
                });
                
                const infoWindow = new google.maps.InfoWindow({
                  content: `
                    <div>
                      <h3 style="font-weight: bold; margin-bottom: 5px;">${place.name}</h3>
                      <div style="margin-bottom: 5px;">${place.vicinity || ''}</div>
                      <div style="display: flex; align-items: center; margin-bottom: 5px;">
                        <span style="color: #FFC107; margin-right: 5px;">★</span>
                        <span>${place.rating || 'No rating'}</span>
                      </div>
                    </div>
                  `
                });
                
                marker.addListener('click', () => {
                  infoWindow.open(map, marker);
                });
                
                bounds.extend(place.geometry.location);
                newMarkers.push(marker);
              });
              
              // Store markers reference
              markersRef.current = newMarkers;
              
              // Adjust map to show all markers
              if (newMarkers.length > 0) {
                map.fitBounds(bounds);
              }
            }
          }
        );
      }
    }
  };

  // Process assistant response for map commands
  const processMapCommands = (text: string) => {
    // Extract potential map commands from the text
    const lowerText = text.toLowerCase();
    
    // Check for facility type filter commands
    if (lowerText.includes('assisted living') || lowerText.includes('show assisted living')) {
      applyMapFilters('assisted-living', activeLocation);
    } else if (lowerText.includes('memory care') || lowerText.includes('show memory care')) {
      applyMapFilters('memory-care', activeLocation);
    } else if (lowerText.includes('skilled nursing') || lowerText.includes('show skilled nursing')) {
      applyMapFilters('skilled-nursing', activeLocation);
    } else if (lowerText.includes('independent living') || lowerText.includes('show independent living')) {
      applyMapFilters('independent-living', activeLocation);
    } else if (lowerText.includes('show all facilities') || lowerText.includes('reset facility filter')) {
      applyMapFilters('all', activeLocation);
    }
    
    // Check for location filter commands
    if (lowerText.includes('san francisco') || lowerText.includes('in san francisco')) {
      applyMapFilters(activeFilter, 'san-francisco');
    } else if (lowerText.includes('oakland') || lowerText.includes('in oakland')) {
      applyMapFilters(activeFilter, 'oakland');
    } else if (lowerText.includes('san jose') || lowerText.includes('in san jose')) {
      applyMapFilters(activeFilter, 'san-jose');
    } else if (lowerText.includes('palo alto') || lowerText.includes('in palo alto')) {
      applyMapFilters(activeFilter, 'palo-alto');
    } else if (lowerText.includes('los angeles') || lowerText.includes('in los angeles')) {
      applyMapFilters(activeFilter, 'los-angeles');
    } else if (lowerText.includes('all locations') || lowerText.includes('reset location filter')) {
      applyMapFilters(activeFilter, 'all');
    }
  };

  // Send message to OpenAI Assistant and animate the response with D-ID
  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Add user message to chat
    const userMessage = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // 1. Add message to OpenAI thread
      await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'OpenAI-Beta': 'assistants=v2'  // Updated to v2
        },
        body: JSON.stringify({
          role: 'user',
          content: input
        })
      });

      // 2. Run the assistant on the thread
      const runResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'OpenAI-Beta': 'assistants=v2'  // Updated to v2
        },
        body: JSON.stringify({
          assistant_id: ASSISTANT_ID,
          instructions: "You are Ava, a helpful assistant for senior care. You can help users find senior care facilities on the interactive map. When users ask about specific facility types like 'assisted living' or 'memory care', or locations like 'San Francisco' or 'Oakland', you should respond accordingly and the map will update to filter those facilities. You can also suggest facilities based on their needs."
        })
      });
      
      if (!runResponse.ok) {
        const errorData = await runResponse.json();
        console.error('Run creation error:', errorData);
        throw new Error(`Failed to run assistant: ${errorData.error?.message || 'Unknown error'}`);
      }
      
      const runData = await runResponse.json();
      const runId = runData.id;
      
      // 3. Poll for completion
      let runStatus = 'in_progress';
      while (runStatus === 'in_progress' || runStatus === 'queued') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const statusResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs/${runId}`, {
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'OpenAI-Beta': 'assistants=v2'  // Updated to v2
          }
        });
        
        if (!statusResponse.ok) {
          const errorData = await statusResponse.json();
          console.error('Status check error:', errorData);
          throw new Error(`Failed to check run status: ${errorData.error?.message || 'Unknown error'}`);
        }
        
        const statusData = await statusResponse.json();
        runStatus = statusData.status;
      }
      
      if (runStatus === 'completed') {
        // 4. Retrieve messages
        const messagesResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'OpenAI-Beta': 'assistants=v2'  // Updated to v2
          }
        });
        
        if (!messagesResponse.ok) {
          const errorData = await messagesResponse.json();
          console.error('Messages retrieval error:', errorData);
          throw new Error(`Failed to retrieve messages: ${errorData.error?.message || 'Unknown error'}`);
        }
        
        const messagesData = await messagesResponse.json();
        const lastMessage = messagesData.data[0];
        // Adjust for potential structure differences in v2 API
        const assistantResponse = lastMessage.content[0].text?.value || 'I apologize, but I couldn\'t process your request at this time.';
        
        // 5. Process map commands in the response
        processMapCommands(assistantResponse);
        
        // 6. Send to D-ID for animation
        const didResponse = await fetch('https://api.d-id.com/talks', {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${DID_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            script: {
              type: 'text',
              input: assistantResponse,
              provider: {
                type: 'microsoft',
                voice_id: 'en-US-AriaNeural'
              }
            },
            source_url: 'https://create-images-results.d-id.com/DefaultPresenters/Erica_f/image.jpeg',
            config: { fluent: true, pad_audio: 0 }
          })
        });
        
        if (!didResponse.ok) {
          const errorData = await didResponse.json();
          console.error('D-ID error:', errorData);
          throw new Error('Failed to create D-ID talk');
        }
        
        const didData = await didResponse.json();
        
        // 7. Poll for D-ID result
        let didStatus = 'created';
        let resultUrl = '';
        
        while (didStatus !== 'done') {
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const didStatusResponse = await fetch(`https://api.d-id.com/talks/${didData.id}`, {
            headers: {
              'Authorization': `Basic ${DID_API_KEY}`,
            }
          });
          
          if (!didStatusResponse.ok) {
            const errorData = await didStatusResponse.json();
            console.error('D-ID status error:', errorData);
            throw new Error('Failed to check D-ID status');
          }
          
          const didStatusData = await didStatusResponse.json();
          didStatus = didStatusData.status;
          
          if (didStatus === 'done') {
            resultUrl = didStatusData.result_url;
          }
        }
        
        // 8. Add assistant message to chat and play video
        setMessages(prev => [...prev, { role: 'assistant', content: assistantResponse }]);
        
        if (videoRef.current && resultUrl) {
          videoRef.current.src = resultUrl;
          videoRef.current.play();
        }
      } else {
        console.error('Run ended with status:', runStatus);
        toast.error(`Assistant run ended with status: ${runStatus}`);
      }
    } catch (error) {
      console.error('Error in chat process:', error);
      toast.error('An error occurred while processing your message');
    } finally {
      setIsLoading(false);
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
          {/* Left Column: Chat & Avatar */}
          <div className="w-full lg:w-1/2 flex flex-col gap-6">
            {/* Chat Interface */}
            <Card>
              <CardHeader>
                <CardTitle>Chat with Ava</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px] overflow-y-auto">
                <div className="space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      Start a conversation with Ava about finding senior care facilities
                    </div>
                  ) : (
                    messages.map((message, index) => (
                      <div 
                        key={index} 
                        className={`p-3 rounded-lg ${
                          message.role === 'user' 
                            ? 'bg-primary text-primary-foreground ml-12' 
                            : 'bg-muted mr-12'
                        }`}
                      >
                        {message.content}
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex items-center w-full gap-2">
                  <Input
                    placeholder="Ask Ava about senior care facilities..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                    disabled={isLoading}
                  />
                  <Button onClick={handleSendMessage} disabled={isLoading}>
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send'}
                  </Button>
                </div>
              </CardFooter>
            </Card>

            {/* Avatar Display */}
            <Card className="h-[300px]">
              <CardHeader>
                <CardTitle>Ava</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-10">
                    <Loader2 className="h-16 w-16 animate-spin text-primary" />
                    <p className="mt-4 text-muted-foreground">Processing your request...</p>
                  </div>
                ) : (
                  <>
                    <video 
                      ref={videoRef}
                      className="w-full max-w-md rounded-lg shadow-lg"
                      controls
                      autoPlay
                      playsInline
                    />
                    {messages.length === 0 && (
                      <div className="mt-6 text-center text-muted-foreground">
                        Ava will appear here when you start chatting
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Map */}
          <div className="w-full lg:w-1/2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Senior Care Facilities Map
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="relative h-[600px]">
                  {/* Active Filters Display */}
                  <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2">
                    {activeFilter !== 'all' && (
                      <Badge className="bg-healthcare-600">
                        {activeFilter.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </Badge>
                    )}
                    {activeLocation !== 'all' && (
                      <Badge className="bg-healthcare-600">
                        {activeLocation.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </Badge>
                    )}
                  </div>
                
                  {/* Map Container */}
                  {isPro ? (
                    <div ref={mapRef} className="h-full rounded-b-lg"></div>
                  ) : (
                    <div className="h-full rounded-b-lg bg-slate-100 flex items-center justify-center">
                      <div className="text-center p-6">
                        <MapPin className="h-12 w-12 text-healthcare-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">Interactive Map</h3>
                        <p className="text-muted-foreground mb-4 max-w-xs">
                          Upgrade to Pro to access our interactive map and search for senior care facilities near you.
                        </p>
                        <Button asChild className="bg-healthcare-600">
                          <a href="/profile">Upgrade to Pro</a>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
              {isPro && (
                <div className="text-center text-xs text-muted-foreground py-2 border-t">
                  Map data ©{new Date().getFullYear()} Google
                </div>
              )}
            </Card>
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

      {/* Google Maps Script - will load conditionally in useEffect */}
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
