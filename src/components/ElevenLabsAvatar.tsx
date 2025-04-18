
import React, { useEffect, useState } from 'react';
import { useAvatarResponse } from '@/context/AvatarResponseContext';
import { Loader2 } from 'lucide-react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'elevenlabs-convai': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        'agent-id': string;
      };
    }
  }
}

const ElevenLabsAvatar = () => {
  const { setLastResponse } = useAvatarResponse();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Handle ElevenLabs response
    const handleElevenLabsResponse = (event: any) => {
      if (event.detail?.response) {
        setLastResponse(event.detail.response);
        setIsLoading(false);
      }
    };

    // Handle when ElevenLabs is ready
    const handleElevenLabsReady = () => {
      setIsLoading(false);
    };

    // Handle ElevenLabs errors
    const handleElevenLabsError = (event: any) => {
      console.error("ElevenLabs Error:", event.detail);
      setError("Avatar service encountered an error. Please try again later.");
      setIsLoading(false);
    };

    // Check if ElevenLabs widget loads
    const checkElevenLabsAvailability = () => {
      setTimeout(() => {
        const widget = document.querySelector('elevenlabs-convai');
        if (widget && isLoading) {
          // Check if the widget has content
          if (!widget.shadowRoot || widget.shadowRoot.childNodes.length === 0) {
            setError("ElevenLabs widget failed to load. Please refresh the page.");
          } else {
            setIsLoading(false);
          }
        }
      }, 8000);
    };

    window.addEventListener('elevenlabs-response', handleElevenLabsResponse);
    window.addEventListener('elevenlabs-ready', handleElevenLabsReady);
    window.addEventListener('elevenlabs-error', handleElevenLabsError);
    
    // Ensure the ElevenLabs script is loaded
    const script = document.createElement('script');
    script.src = 'https://elevenlabs.io/convai-widget/index.js';
    script.async = true;
    script.type = 'text/javascript';
    document.body.appendChild(script);
    
    checkElevenLabsAvailability();

    return () => {
      window.removeEventListener('elevenlabs-response', handleElevenLabsResponse);
      window.removeEventListener('elevenlabs-ready', handleElevenLabsReady);
      window.removeEventListener('elevenlabs-error', handleElevenLabsError);
      
      // Don't remove the script as it may be used by other components
    };
  }, [setLastResponse, isLoading]);

  return (
    <div className="relative w-full h-full min-h-[250px] bg-gray-100 rounded-lg flex items-center justify-center">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-75 z-10">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
          <p className="text-red-500 font-medium text-center px-4">{error}</p>
        </div>
      )}
      
      <elevenlabs-convai 
        agent-id="R9M1zBEUj8fTGAij61wb" 
        className="w-full h-full"
      />
    </div>
  );
};

export default ElevenLabsAvatar;
