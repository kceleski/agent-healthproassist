
import { useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface AvatarDisplayProps {
  isLoading: boolean;
  hasMessages: boolean;
  videoUrl?: string;
}

export const AvatarDisplay = ({ isLoading, hasMessages, videoUrl }: AvatarDisplayProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Health Assistant Avatar</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Processing your request...</p>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center">
            <div className="w-full h-[350px] rounded-lg bg-gray-100 flex items-center justify-center">
              {!hasMessages && (
                <div className="text-center text-muted-foreground">
                  Your assistant will appear here
                </div>
              )}
            </div>
            
            {videoUrl && (
              <video 
                ref={videoRef}
                className="w-full max-w-md rounded-lg shadow-lg mt-4"
                controls
                autoPlay
                playsInline
                src={videoUrl}
              />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
