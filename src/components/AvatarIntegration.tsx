
import React, { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DIDAvatar from './DIDAvatar';
import ElevenLabsAvatar from './ElevenLabsAvatar';
import { useLocation } from 'react-router-dom';

type AvatarIntegrationType = 'elevenlabs' | 'did';

const AvatarIntegration: React.FC = () => {
  const [currentIntegration, setCurrentIntegration] = useState<AvatarIntegrationType>('elevenlabs');
  const location = useLocation();
  
  // Only show on map page
  const isMapPage = location.pathname.includes('/map');
  
  if (!isMapPage) {
    return null;
  }

  const toggleIntegration = () => {
    setCurrentIntegration(current => 
      current === 'elevenlabs' ? 'did' : 'elevenlabs'
    );
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-4 mb-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Avatar Integration</span>
          <div className="flex items-center space-x-2 text-sm">
            <span className={currentIntegration === 'elevenlabs' ? 'font-bold' : ''}>ElevenLabs</span>
            <Switch 
              id="avatar-integration" 
              checked={currentIntegration === 'did'}
              onCheckedChange={toggleIntegration}
            />
            <span className={currentIntegration === 'did' ? 'font-bold' : ''}>D-ID</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col space-y-4">
        {currentIntegration === 'elevenlabs' && <ElevenLabsAvatar />}
        {currentIntegration === 'did' && <DIDAvatar />}
      </CardContent>
    </Card>
  );
};

export default AvatarIntegration;
