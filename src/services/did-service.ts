
const DID_API_KEY = import.meta.env.VITE_DID_API_KEY;

/**
 * Interface for D-ID API response
 */
interface DIDResponse {
  id: string;
  status: string;
  result_url?: string;
  [key: string]: any;
}

/**
 * Creates a D-ID talk animation from text
 * @param text The text to animate
 * @param sourceUrl The presenter image URL (optional)
 * @returns URL to the animated video
 */
export const animateResponse = async (
  text: string, 
  sourceUrl: string = 'https://create-images-results.d-id.com/DefaultPresenters/Erica_f/image.jpeg'
): Promise<string> => {
  try {
    // Create the talk
    const didResponse = await createDIDTalk(text, sourceUrl);
    
    // Poll for completion
    let didStatus = 'created';
    let resultUrl = '';
    
    while (didStatus !== 'done') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const statusData = await checkDIDTalkStatus(didResponse.id);
      didStatus = statusData.status;
      
      if (didStatus === 'done') {
        resultUrl = statusData.result_url || '';
      }
    }
    
    return resultUrl;
  } catch (error) {
    console.error('Error animating response:', error);
    throw error;
  }
};

/**
 * Creates a new D-ID talk
 * @param text The text to animate
 * @param sourceUrl The presenter image URL
 * @returns The D-ID response
 */
export const createDIDTalk = async (
  text: string,
  sourceUrl: string
): Promise<DIDResponse> => {
  try {
    const response = await fetch('https://api.d-id.com/talks', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${DID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        script: {
          type: 'text',
          input: text,
          provider: {
            type: 'microsoft',
            voice_id: 'en-US-AriaNeural'
          }
        },
        source_url: sourceUrl,
        config: { fluent: true, pad_audio: 0 }
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to create D-ID talk: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating D-ID talk:', error);
    throw error;
  }
};

/**
 * Checks the status of a D-ID talk
 * @param talkId The talk ID
 * @returns The D-ID status response
 */
export const checkDIDTalkStatus = async (talkId: string): Promise<DIDResponse> => {
  try {
    const response = await fetch(`https://api.d-id.com/talks/${talkId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${DID_API_KEY}`,
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to check D-ID status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error checking D-ID talk status:', error);
    throw error;
  }
};
