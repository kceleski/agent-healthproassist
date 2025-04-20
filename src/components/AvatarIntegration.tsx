
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocation } from 'react-router-dom';

const AvatarIntegration: React.FC = () => {
  const location = useLocation();
  
  // Only show on map page
  const isMapPage = location.pathname.includes('/map');
  
  if (!isMapPage) {
    return null;
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-4 mb-6">
      <CardHeader>
        <CardTitle>Voice Assistant</CardTitle>
      </CardHeader>
      <CardContent>
        <elevenlabs-convai 
          agent-id="R9M1zBEUj8fTGAij61wb"
          className="w-full h-full min-h-[350px] rounded-lg bg-gray-100"
        />
      </CardContent>
    </Card>
  );
};

export default AvatarIntegration;
