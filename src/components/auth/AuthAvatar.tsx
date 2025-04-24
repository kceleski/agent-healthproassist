
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface AuthAvatarProps {
  showAvatar: boolean;
  onClose: () => void;
}

export const AuthAvatar = ({ showAvatar, onClose }: AuthAvatarProps) => {
  if (!showAvatar) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Health Assistant</span>
            <Button variant="ghost" size="sm" onClick={onClose}>×</Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <elevenlabs-convai 
            agent-id="R9M1zBEUj8fTGAij61wb" 
            className="w-full h-[350px] rounded-lg bg-gray-100"
          />
        </CardContent>
      </Card>
    </div>
  );
};
