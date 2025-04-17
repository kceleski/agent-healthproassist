
import React, { useEffect, useState } from 'react';
import { useAvatarResponse } from '@/context/AvatarResponseContext';
import { Loader2 } from 'lucide-react';

const DIDAvatar = () => {
  const { setLastResponse } = useAvatarResponse();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Handle D-ID response
    const handleDIDResponse = (event: any) => {
      if (event.detail?.result?.text) {
        setLastResponse(event.detail.result.text);
      }
      
      // Clear loading state on any response
      setIsLoading(false);
    };

    // Handle D-ID errors
    const handleDIDError = (event: any) => {
      console.error("D-ID Error:", event.detail);
      setError("Avatar service unavailable. Please try again later.");
      setIsLoading(false);
    };

    // Check if D-ID agent is available
    const checkDIDAvailability = () => {
      // If D-ID script doesn't initialize within 5 seconds, show error
      setTimeout(() => {
        if (isLoading) {
          const container = document.getElementById('did-avatar-container');
          if (container && !container.innerHTML) {
            setError("Avatar service unavailable. Please try refreshing.");
            setIsLoading(false);
          }
        }
      }, 5000);
    };

    window.addEventListener('d-id-response', handleDIDResponse);
    window.addEventListener('d-id-error', handleDIDError);
    
    checkDIDAvailability();
    
    return () => {
      window.removeEventListener('d-id-response', handleDIDResponse);
      window.removeEventListener('d-id-error', handleDIDError);
    };
  }, [setLastResponse, isLoading]);

  return (
    <div className="relative w-full aspect-video bg-gray-100 rounded-lg">
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
      
      <div 
        id="did-avatar-container" 
        className="w-full aspect-video bg-gray-100 rounded-lg"
        data-name="did-agent"
        data-mode="fabio"
        data-client-key="Z29vZ2xlLW9hdXRoMnwxMDczMTY2OTQxNDk2MjA5NTE1NzI6VHRmVE13cXBSQWk4eU5qTHpLT1J4"
        data-agent-id="agt_BvPZpW03"
        data-monitor="true"
      />
    </div>
  );
};

export default DIDAvatar;
