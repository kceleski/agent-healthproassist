
export const createDIDAnimation = async (
  text: string, 
  DID_API_KEY: string
): Promise<string | null> => {
  try {
    const didResponse = await fetch('https://api.d-id.com/talks', {
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
        source_url: 'https://create-images-results.d-id.com/DefaultPresenters/Erica_f/image.jpeg',
        config: { fluent: true, pad_audio: 0 }
      })
    });

    if (!didResponse.ok) throw new Error('Failed to create D-ID talk');
    
    const didData = await didResponse.json();
    
    let didStatus = 'created';
    let resultUrl = '';
    
    while (didStatus !== 'done') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const didStatusResponse = await fetch(`https://api.d-id.com/talks/${didData.id}`, {
        headers: {
          'Authorization': `Basic ${DID_API_KEY}`,
        }
      });
      
      if (!didStatusResponse.ok) throw new Error('Failed to check D-ID status');
      
      const didStatusData = await didStatusResponse.json();
      didStatus = didStatusData.status;
      
      if (didStatus === 'done') {
        resultUrl = didStatusData.result_url;
      }
    }
    
    return resultUrl;
  } catch (error) {
    console.error('Error creating D-ID animation:', error);
    return null;
  }
};
