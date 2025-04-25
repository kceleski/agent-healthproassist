
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const AvaButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-[#9b87f5] hover:bg-[#7E69AB] flex items-center gap-2"
      >
        <Bot className="h-4 w-4" />
        Ask Ava for Help
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chat with Ava</DialogTitle>
            <DialogDescription>
              Let Ava help you find the perfect facility for your needs
            </DialogDescription>
          </DialogHeader>
          <div className="h-[450px] w-full">
            <elevenlabs-convai 
              agent-id="56BNlFTfXmpCKJ5XxqtW"
              className="w-full h-full"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
