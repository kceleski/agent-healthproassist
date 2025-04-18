
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ElevenLabsAvatar from './ElevenLabsAvatar';
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
        <CardTitle>AI Avatar</CardTitle>
      </CardHeader>
      <CardContent>
        <ElevenLabsAvatar />
      </CardContent>
    </Card>
  );
};

export default AvatarIntegration;
