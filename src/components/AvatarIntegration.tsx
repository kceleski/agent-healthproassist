
import React, { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DIDAvatar from './DIDAvatar';
import ElevenLabsAvatar from './ElevenLabsAvatar';

type AvatarIntegrationType = 'elevenlabs' | 'did';

const AvatarIntegration: React.FC = () => {
  const [currentIntegration, setCurrentIntegration] = useState<AvatarIntegrationType>('elevenlabs');

  const toggleIntegration = () => {
    setCurrentIntegration(current => 
      current === 'elevenlabs' ? 'did' : 'elevenlabs'
    );
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-4">
      <CardHeader>
        <CardTitle>Avatar Integration</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col space-y-4">
        <div className="flex items-center space-x-2">
          <Switch 
            id="avatar-integration" 
            checked={currentIntegration === 'did'}
            onCheckedChange={toggleIntegration}
          />
          <Label htmlFor="avatar-integration">
            {currentIntegration === 'elevenlabs' 
              ? 'ElevenLabs Active' 
              : 'D-ID Active'}
          </Label>
        </div>

        {currentIntegration === 'elevenlabs' && <ElevenLabsAvatar />}
        {currentIntegration === 'did' && <DIDAvatar />}
      </CardContent>
    </Card>
  );
};

export default AvatarIntegration;
