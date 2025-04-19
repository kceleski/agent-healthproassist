
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { headers } = req;
    const upgradeHeader = headers.get("upgrade") || "";

    if (upgradeHeader.toLowerCase() !== "websocket") {
      return new Response("Expected WebSocket connection", { 
        status: 400,
        headers: corsHeaders
      });
    }

    const { socket: clientSocket, response } = Deno.upgradeWebSocket(req);
    
    // Connect to OpenAI's WebSocket
    const openAISocket = new WebSocket("wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01");
    
    openAISocket.onopen = () => {
      console.log("Connected to OpenAI WebSocket");
    };

    // Handle messages from client
    clientSocket.onmessage = async (event) => {
      const message = JSON.parse(event.data);
      console.log("Received message from client:", message);

      // Update the session configuration after session.created
      if (message.type === 'session.created') {
        const sessionConfig = {
          type: "session.update",
          session: {
            modalities: ["text"],
            instructions: `You are a helpful assistant specializing in senior care facility search. 
            When users ask about facilities, interpret their needs and provide specific search parameters.
            Consider factors like:
            - Type of care (assisted living, memory care, etc.)
            - Location preferences
            - Specific amenities or services
            - Price range if mentioned
            Always structure your responses to include specific search parameters that can be used to filter the map.`,
            tools: [{
              type: "function",
              name: "update_map_filters",
              description: "Update the map filters based on user search criteria",
              parameters: {
                type: "object",
                properties: {
                  facilityType: {
                    type: "array",
                    items: { 
                      type: "string",
                      enum: ["assisted-living", "memory-care", "skilled-nursing", "independent-living", "all"]
                    }
                  },
                  location: { type: "string" },
                  amenities: {
                    type: "array",
                    items: { type: "string" }
                  },
                  priceRange: { type: "string" }
                },
                required: ["facilityType", "location"]
              }
            }]
          }
        };
        openAISocket.send(JSON.stringify(sessionConfig));
      }

      // Forward user messages to OpenAI
      openAISocket.send(event.data);
    };

    // Forward OpenAI responses to client
    openAISocket.onmessage = (event) => {
      clientSocket.send(event.data);
    };

    // Handle WebSocket closure
    clientSocket.onclose = () => {
      console.log("Client WebSocket closed");
      openAISocket.close();
    };

    return response;
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
});
