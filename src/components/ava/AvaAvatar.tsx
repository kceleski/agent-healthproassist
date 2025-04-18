
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface AvaAvatarProps {
  isLoading: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
  hasMessages: boolean;
}

export function AvaAvatar({ isLoading, videoRef, hasMessages }: AvaAvatarProps) {
  return (
    <Card className="h-[300px]">
      <CardHeader>
        <CardTitle>Ava</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-10">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Processing your request...</p>
          </div>
        ) : (
          <>
            <video 
              ref={videoRef}
              className="w-full max-w-md rounded-lg shadow-lg"
              controls
              autoPlay
              playsInline
            />
            {!hasMessages && (
              <div className="mt-6 text-center text-muted-foreground">
                Ava will appear here when you start chatting
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
