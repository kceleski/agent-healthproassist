import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Loader2, MapPin, Search } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from "@/context/AuthContext";
import { getUserTier } from '@/utils/subscription';
import { Badge } from "@/components/ui/badge";
import { Helmet } from "react-helmet";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// API keys
const OPENAI_API_KEY = "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";
const DID_API_KEY = "Z29vZ2xlLW9hdXRoMnwxMDczMTY2OTQxNDk2MjA5NTE1NzI6VHRmVE13cXBSQWk4eU5qTHpLT1J4";
const ASSISTANT_ID = "asst_83MVmU8KUWFD8zsJOIVjh9i2";
const GOOGLE_MAPS_API_KEY = "AIzaSyCxAU5BCCcICK4HdmkLfEDSQB3EvBwQQbE";
const STOREPOINT_TOKEN = "sk_0ef86d99b602413667aeedcf714d3e88059dbc54646f99d0268a51e793bae370";

// Map filter types
type FilterType = 'assisted-living' | 'memory-care' | 'skilled-nursing' | 'independent-living' | 'all';
type LocationArea = 'san-francisco' | 'oakland' | 'san-jose' | 'palo-alto' | 'los-angeles' | 'all';

const AvaMapPage = () => {
  const { user } = useAuth();
  const isPro = getUserTier(user) === 'premium';
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement | null>(null);

  // Assistant thread management
  const [threadId, setThreadId] = useState<string | null>(localStorage.getItem('assistant_thread_id'));
  
  // Map filter state
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [activeLocation, setActiveLocation] = useState<LocationArea>('all');
  
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

  // StorePoint integration
  useEffect(() => {
    if (isPro) {
      // This will run after the StorePoint script has loaded for premium users
      const checkSP = setInterval(function() {
        if (typeof window.SP !== 'undefined') {
          clearInterval(checkSP);
          
          // Configure map display
          window.SP.options.maxLocations = 25; // Show 25 locations at a time
          window.SP.options.defaultView = 'map'; // Start with map view
          
          // Set up event listeners
          window.SP.on('markerClick', function(location: any) {
            console.log('Location selected:', location.name);
            window.selectedLocation = location;
          });
        }
      }, 100);

      // Clean up interval on component unmount
      return () => {
        clearInterval(checkSP);
      };
    }
  }, [isPro]);

  // Apply map filters
  const applyMapFilters = (filterType: FilterType, location: LocationArea) => {
    if (typeof window.SP !== 'undefined') {
      let tagFilter = '';
      
      // Set facility type filter
      switch(filterType) {
        case 'assisted-living':
          tagFilter = 'assisted living community';
          break;
        case 'memory-care':
          tagFilter = 'memory care community';
          break;
        case 'skilled-nursing':
          tagFilter = 'skilled nursing facility';
          break;
        case 'independent-living':
          tagFilter = 'independent living community';
          break;
        case 'all':
          // No tag filter
          break;
      }
      
      // Apply the tag filter
      if (tagFilter) {
        window.SP.filter('tags', tagFilter);
      } else {
        window.SP.filter('tags', null);
      }
      
      // Set location filter
      let locationFilter = '';
      
      switch(location) {
        case 'san-francisco':
          locationFilter = 'San Francisco';
          break;
        case 'oakland':
          locationFilter = 'Oakland';
          break;
        case 'san-jose':
          locationFilter = 'San Jose';
          break;
        case 'palo-alto':
          locationFilter = 'Palo Alto';
          break;
        case 'los-angeles':
          locationFilter = 'Los Angeles';
          break;
        case 'all':
          // No location filter
          break;
      }
      
      // Apply the location filter
      if (locationFilter) {
        window.SP.filter('city', locationFilter);
      } else {
        window.SP.filter('city', null);
      }
      
      setActiveFilter(filterType);
      setActiveLocation(location);
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
                  <div id="storepoint-container" data-map-id="1645a775a8a422" className="h-full rounded-b-lg"></div>
                </div>
              </CardContent>
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

      {/* StorePoint Script */}
      <Helmet>
        <script async src="https://cse.google.com/cse.js?cx=d5643f65b5a2e487f"></script>
        <script>
          {`
            (function(){
              var a=document.createElement("script");
              a.type="text/javascript";
              a.async=!0;
              a.src="https://cdn.storepoint.co/api/v1/js/1645a775a8a422.js";
              var b=document.getElementsByTagName("script")[0];
              b.parentNode.insertBefore(a,b);
            }());
          `}
        </script>
      </Helmet>
    </div>
  );
};

export default AvaMapPage;
