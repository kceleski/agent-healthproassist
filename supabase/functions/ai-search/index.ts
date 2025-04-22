
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

// Load environment variables
const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

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

    // Create WebSocket connection
    const { socket: clientSocket, response } = Deno.upgradeWebSocket(req);
    console.log("WebSocket connection established");
    
    // Track whether we've sent the session.update message
    let sessionConfigured = false;

    // Handle messages from client
    clientSocket.onmessage = async (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log("Received message from client:", message);

        // If this is the first message after connection (session.created)
        if (message.type === 'session.created' || (!sessionConfigured && message.type === 'message')) {
          // Send session configuration
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
          
          clientSocket.send(JSON.stringify(sessionConfig));
          sessionConfigured = true;
          console.log("Session configured");
          
          // If this was just a session creation message, return
          if (message.type === 'session.created') {
            return;
          }
        }

        // Handle actual user messages
        if (message.type === 'message') {
          const userMessage = message.message || "";
          
          // Process user query with local rules (as a fallback if OpenAI is unavailable)
          processLocalSearch(userMessage).then(result => {
            // Send tool call with extracted parameters
            clientSocket.send(JSON.stringify({
              type: 'tool.call',
              tool: {
                name: 'update_map_filters',
                parameters: result
              }
            }));
            
            // Also send a content message
            clientSocket.send(JSON.stringify({
              type: 'content',
              content: `I've updated your search filters based on your request for "${userMessage}". You can now view the results.`
            }));
          }).catch(error => {
            console.error("Error in local search processing:", error);
            clientSocket.send(JSON.stringify({
              type: 'error',
              error: "Failed to process search query"
            }));
          });

          // If OpenAI key is available, also try to use it for better results
          if (OPENAI_API_KEY) {
            try {
              // Fetch from OpenAI API
              const openAiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                  model: "gpt-4o-mini",
                  messages: [
                    {
                      role: "system",
                      content: `You are an AI assistant specializing in senior care facility searches. 
                      Extract search parameters from the user query and return ONLY a JSON object with these fields:
                      - facilityType: array of strings ["assisted-living", "memory-care", "skilled-nursing", "independent-living"] or ["all"]
                      - location: string (city, state or zip)
                      - amenities: array of strings (e.g. ["dining", "transport", "activities", "pets", "medical", "rehab"])
                      - priceRange: string (optional)
                      Do not include ANY explanation, ONLY the JSON object.`
                    },
                    {
                      role: "user",
                      content: userMessage
                    }
                  ],
                  temperature: 0.1
                })
              });
              
              const data = await openAiResponse.json();
              
              if (data.choices && data.choices[0]?.message?.content) {
                try {
                  const content = data.choices[0].message.content;
                  // Try to parse the response as JSON
                  const jsonMatch = content.match(/\{.*\}/s);
                  
                  if (jsonMatch) {
                    const params = JSON.parse(jsonMatch[0]);
                    console.log("OpenAI extracted parameters:", params);
                    
                    // Send the tool call with extracted parameters
                    clientSocket.send(JSON.stringify({
                      type: 'tool.call',
                      tool: {
                        name: 'update_map_filters',
                        parameters: params
                      }
                    }));
                    
                    // Also send a content message
                    clientSocket.send(JSON.stringify({
                      type: 'content',
                      content: `I've updated your search filters based on your request. You can now view the results.`
                    }));
                  }
                } catch (parseError) {
                  console.error("Failed to parse OpenAI response as JSON:", parseError);
                  // Fallback to local processing (which was already triggered)
                }
              }
            } catch (openAiError) {
              console.error("OpenAI API error:", openAiError);
              // The local processing will still work as fallback
            }
          }
        }
      } catch (error) {
        console.error("Error processing message:", error);
        clientSocket.send(JSON.stringify({
          type: 'error',
          error: "Failed to process message"
        }));
      }
    };

    // Handle WebSocket closure
    clientSocket.onclose = () => {
      console.log("WebSocket closed");
    };

    clientSocket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return response;
  } catch (error) {
    console.error("Error handling request:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
});

// Local search processing function (fallback if OpenAI is unavailable)
async function processLocalSearch(query: string) {
  const result = {
    facilityType: [] as string[],
    location: "Phoenix, AZ",
    amenities: [] as string[],
  };
  
  // Extract facility types
  if (query.toLowerCase().includes("memory care")) {
    result.facilityType.push("memory-care");
  }
  if (query.toLowerCase().includes("assisted living")) {
    result.facilityType.push("assisted-living");
  }
  if (query.toLowerCase().includes("nursing")) {
    result.facilityType.push("skilled-nursing");
  }
  if (query.toLowerCase().includes("independent living")) {
    result.facilityType.push("independent-living");
  }
  
  // Default to "all" if no specific type is found
  if (result.facilityType.length === 0) {
    result.facilityType = ["all"];
  }
  
  // Extract location (very basic)
  const cityMatches = query.match(/(in|near|around|at)\s+([A-Za-z\s]+)(,\s*[A-Z]{2})?/i);
  if (cityMatches && cityMatches[2]) {
    result.location = cityMatches[2].trim();
    if (cityMatches[3]) {
      result.location += cityMatches[3]; // Add the state if present
    }
  }
  
  // Extract amenities
  if (query.toLowerCase().includes("dining")) result.amenities.push("dining");
  if (query.toLowerCase().includes("transport")) result.amenities.push("transport");
  if (query.toLowerCase().includes("activit")) result.amenities.push("activities");
  if (query.toLowerCase().includes("pet")) result.amenities.push("pets");
  if (query.toLowerCase().includes("medical") || query.toLowerCase().includes("staff")) result.amenities.push("medical");
  if (query.toLowerCase().includes("rehab")) result.amenities.push("rehab");
  
  return result;
}
