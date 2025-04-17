
import React, { useEffect } from 'react';
import { useAvatarResponse } from '@/context/AvatarResponseContext';

const DIDAvatar = () => {
  const { setLastResponse } = useAvatarResponse();

  useEffect(() => {
    // Handle D-ID response
    const handleDIDResponse = (event: any) => {
      if (event.detail?.result?.text) {
        setLastResponse(event.detail.result.text);
      }
    };

    window.addEventListener('d-id-response', handleDIDResponse);
    return () => window.removeEventListener('d-id-response', handleDIDResponse);
  }, [setLastResponse]);

  return (
    <div 
      id="did-avatar-container" 
      className="w-full aspect-video bg-gray-100 rounded-lg"
      data-name="did-agent"
      data-mode="fabio"
      data-client-key="Z29vZ2xlLW9hdXRoMnwxMDczMTY2OTQxNDk2MjA5NTE1NzI6VHRmVE13cXBSQWk4eU5qTHpLT1J4"
      data-agent-id="agt_BvPZpW03"
      data-monitor="true"
    />
  );
};

export default DIDAvatar;
