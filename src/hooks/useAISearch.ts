
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

interface AISearchFilters {
  facilityType: string[];
  location: string;
  amenities?: string[];
  priceRange?: string;
}

export const useAISearch = (onFiltersUpdate: (filters: AISearchFilters) => void) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const ws = new WebSocket(`wss://zpfaojrmcozacnsnwmra.supabase.co/functions/v1/ai-search`);

    ws.onopen = () => {
      console.log('Connected to AI Search WebSocket');
      setIsConnected(true);
      toast.success('Connected to AI assistant');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Received message:', data);

      if (data.type === 'response.function_call_arguments.done') {
        try {
          const args = JSON.parse(data.arguments);
          onFiltersUpdate(args);
        } catch (error) {
          console.error('Error parsing function arguments:', error);
        }
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      toast.error('Connection error with AI assistant');
    };

    ws.onclose = () => {
      console.log('WebSocket closed');
      setIsConnected(false);
      toast.error('Disconnected from AI assistant');
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [onFiltersUpdate]);

  const sendMessage = useCallback((message: string) => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      toast.error('Not connected to AI assistant');
      return;
    }

    socket.send(JSON.stringify({
      type: 'conversation.item.create',
      item: {
        type: 'message',
        role: 'user',
        content: [{
          type: 'input_text',
          text: message
        }]
      }
    }));

    socket.send(JSON.stringify({ type: 'response.create' }));
  }, [socket]);

  return { sendMessage, isConnected };
};
