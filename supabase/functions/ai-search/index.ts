
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();

    // Call OpenAI to analyze the search query
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an AI assistant that helps users search for senior care facilities. 
            Extract search parameters from user queries and return them in a structured format. 
            Parameters should include:
            - facilityType: array of strings ["assisted-living", "memory-care", "skilled-nursing", "independent-living"] or ["all"]
            - location: string (city, state or zip)
            - amenities: array of strings (dining, transport, activities, pets, medical, rehab)
            Return ONLY the JSON object with these fields, no explanation.`
          },
          {
            role: 'user',
            content: query
          }
        ],
        temperature: 0.1
      }),
    });

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    try {
      // Try to parse the response as JSON
      const jsonMatch = content.match(/\{.*\}/s);
      if (jsonMatch) {
        const searchParams = JSON.parse(jsonMatch[0]);
        console.log('Extracted search parameters:', searchParams);
        
        return new Response(JSON.stringify(searchParams), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      throw new Error('Failed to parse search parameters');
    }

    throw new Error('Invalid response format from OpenAI');
  } catch (error) {
    console.error('Error in AI search:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
