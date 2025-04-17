
import React, { useEffect } from 'react';
import { useAvatarResponse } from '@/context/AvatarResponseContext';

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

  useEffect(() => {
    // Handle ElevenLabs response
    const handleElevenLabsResponse = (event: any) => {
      if (event.detail?.response) {
        setLastResponse(event.detail.response);
      }
    };

    window.addEventListener('elevenlabs-response', handleElevenLabsResponse);
    return () => window.removeEventListener('elevenlabs-response', handleElevenLabsResponse);
  }, [setLastResponse]);

  return (
    <elevenlabs-convai agent-id="R9M1zBEUj8fTGAij61wb" />
  );
};

export default ElevenLabsAvatar;
