
import { Button } from "@/components/ui/button";
import { Volume2, VolumeOff } from "lucide-react";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { cn } from "@/lib/utils";

interface VoiceButtonProps {
  text: string;
  voiceId?: string;
  className?: string;
}

export const VoiceButton = ({ text, voiceId, className }: VoiceButtonProps) => {
  const { speak, isLoading } = useTextToSpeech();

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("hover:bg-accent", className)}
      onClick={() => speak(text, voiceId)}
      disabled={isLoading}
    >
      {isLoading ? (
        <VolumeOff className="h-4 w-4" />
      ) : (
        <Volume2 className="h-4 w-4" />
      )}
    </Button>
  );
};
