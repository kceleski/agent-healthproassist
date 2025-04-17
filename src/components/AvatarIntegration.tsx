
import React, { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

        {currentIntegration === 'elevenlabs' && (
          <elevenlabs-convai agent-id="R9M1zBEUj8fTGAij61wb"></elevenlabs-convai>
        )}

        {currentIntegration === 'did' && (
          <script
            type="module"
            src="https://agent.d-id.com/v1/index.js"
            data-name="did-agent"
            data-mode="fabio"
            data-client-key="Z29vZ2xlLW9hdXRoMnwxMDczMTY2OTQxNDk2MjA5NTE1NzI6VHRmVE13cXBSQWk4eU5qTHpLT1J4"
            data-agent-id="agt_BvPZpW03"
            data-monitor="true">
          </script>
        )}
      </CardContent>
    </Card>
  );
};

export default AvatarIntegration;
