
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

interface AISearchFilters {
  facilityType?: string[];
  location?: string;
  amenities?: string[];
  priceRange?: string;
}

export const useAISearch = (onFiltersUpdate: (filters: AISearchFilters) => void) => {
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  // Connect to the Supabase edge function via WebSocket
  useEffect(() => {
    // Get the Supabase project URL and extract project reference
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://zpfaojrmcozacnsnwmra.supabase.co';
    const projectRef = supabaseUrl.match(/https:\/\/(.*?)\.supabase\.co/)?.[1] || 'zpfaojrmcozacnsnwmra';
    
    // Construct WebSocket URL to the edge function
    const wsUrl = `wss://${projectRef}.supabase.co/functions/v1/ai-search`;
    
    let ws: WebSocket;
    
    const connect = () => {
      try {
        console.log('Connecting to AI search service at:', wsUrl);
        ws = new WebSocket(wsUrl);
        
        ws.onopen = () => {
          console.log('Connected to AI search service');
          setIsConnected(true);
          
          // Initialize the session
          ws.send(JSON.stringify({ 
            type: 'session.created',
            message: 'Initialize AI search session' 
          }));
        };
        
        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log('Received from AI search:', data);
            
            // Handle tool calls - update search filters
            if (data.type === 'tool.call' && data.tool?.name === 'update_map_filters') {
              const filters = data.tool.parameters;
              console.log('Filters from AI:', filters);
              onFiltersUpdate(filters);
              
              toast.success('Search criteria updated based on your request!');
            }
            
            // Handle content message - just log for now
            if (data.type === 'content') {
              console.log('AI message:', data.content);
            }
          } catch (error) {
            console.error('Error parsing AI search response:', error);
          }
        };
        
        ws.onclose = (event) => {
          console.log('AI search connection closed', event.code, event.reason);
          setIsConnected(false);
          
          // Try to reconnect after a delay if closed unexpectedly
          if (event.code !== 1000) {
            setTimeout(() => {
              if (document.visibilityState === 'visible') {
                connect();
              }
            }, 3000);
          }
        };
        
        ws.onerror = (error) => {
          console.error('AI search WebSocket error:', error);
          setIsConnected(false);
          
          // Fall back to local simulation if connection fails
          fallbackToLocalSimulation();
        };
        
        setSocket(ws);
      } catch (error) {
        console.error('Error connecting to AI search service:', error);
        setIsConnected(false);
        
        // Fall back to local simulation if connection fails
        fallbackToLocalSimulation();
      }
    };
    
    // Don't establish WebSocket connection if we're on a page that doesn't need it
    // This prevents unnecessary connections when not needed
    const currentPath = window.location.pathname;
    if (currentPath.includes('/search') || currentPath.includes('/map')) {
      connect();
    } else {
      // Set connected to true for other pages so the UI doesn't show loading state
      setIsConnected(true);
    }
    
    // Clean up on unmount
    return () => {
      if (ws) {
        ws.close(1000, 'Component unmounted');
      }
    };
  }, [onFiltersUpdate]);
  
  // Fallback to local simulation if WebSocket connection fails
  const fallbackToLocalSimulation = () => {
    toast.warning('Using local AI simulation. Some features may be limited.');
    setIsConnected(true);
  };

  // Send a message to the AI service
  const sendMessage = useCallback((message: string) => {
    console.log('Search query:', message);
    
    if (socket && socket.readyState === WebSocket.OPEN) {
      // Send to the actual AI service
      socket.send(JSON.stringify({
        type: 'message',
        message
      }));
      
      toast.success('Processing your search request...');
    } else {
      // Fallback to local simulation if WebSocket is not available
      toast.success('Processing your search request (simulation)...');
      
      // Simulate AI processing with realistic timing
      setTimeout(() => {
        // Extract location and care type from the message
        let location = "Phoenix, AZ";
        let facilityType: string[] = [];
        let amenities: string[] = [];
        
        // Basic keyword extraction
        if (message.toLowerCase().includes("memory")) {
          facilityType.push("memory_care");
        } else if (message.toLowerCase().includes("nursing")) {
          facilityType.push("skilled_nursing");
        } else if (message.toLowerCase().includes("assisted")) {
          facilityType.push("assisted_living");
        } else if (message.toLowerCase().includes("independent")) {
          facilityType.push("independent_living");
        }
        
        // Extract location
        const cityMatches = message.match(/(in|near|around|at)\s+([A-Za-z\s]+)(,\s*[A-Z]{2})?/i);
        if (cityMatches && cityMatches[2]) {
          location = cityMatches[2].trim();
          if (cityMatches[3]) {
            location += cityMatches[3]; // Add the state if present
          }
        }
        
        // Extract amenities
        if (message.toLowerCase().includes("dining")) amenities.push("dining");
        if (message.toLowerCase().includes("transport")) amenities.push("transport");
        if (message.toLowerCase().includes("activit")) amenities.push("activities");
        if (message.toLowerCase().includes("pet")) amenities.push("pets");
        if (message.toLowerCase().includes("medical") || message.toLowerCase().includes("staff")) amenities.push("medical");
        if (message.toLowerCase().includes("rehab")) amenities.push("rehab");
        
        // Pass the extracted filters to the callback
        const filters: AISearchFilters = {
          location,
          facilityType: facilityType.length > 0 ? facilityType : undefined,
          amenities: amenities.length > 0 ? amenities : undefined
        };
        
        console.log('Extracted filters (simulation):', filters);
        onFiltersUpdate(filters);
        toast.success('Search criteria updated based on your request (simulation)');
      }, 1500);
    }
  }, [socket, onFiltersUpdate]);

  return {
    sendMessage,
    isConnected
  };
};
