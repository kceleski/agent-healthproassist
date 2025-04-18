
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import HealthProAssistWidget from '@/components/HealthProAssistWidget';
import EmbeddableCareForm from '@/components/healthcare/EmbeddableCareForm';
import { useHealthAssistant } from '@/hooks/use-health-assistant';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { AvatarDisplay } from '@/components/avatar/AvatarDisplay';
import { createDIDAnimation } from '@/services/did-animation';
import { toast } from 'sonner';

// API keys - Consider using environment variables for production
const OPENAI_API_KEY = "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";
const DID_API_KEY = "Z29vZ2xlLW9hdXRoMnwxMDczMTY2OTQxNDk2MjA5NTE1NzI6VHRmVE13cXBSQWk4eU5qTHpLT1J4";
const ASSISTANT_ID = "asst_83MVmU8KUWFD8zsJOIVjh9i2";

const Index = () => {
  const [showWidget, setShowWidget] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('chat');
  const [videoUrl, setVideoUrl] = useState<string | undefined>();
  
  // Get the stored thread ID from localStorage, handling potential null
  const storedThreadId = typeof window !== 'undefined' ? localStorage.getItem('assistant_thread_id') : null;
  
  const { messages, isLoading, sendMessage } = useHealthAssistant(
    storedThreadId,
    OPENAI_API_KEY,
    ASSISTANT_ID
  );

  const handleSendMessage = async (message: string) => {
    try {
      const response = await sendMessage(message);
      if (response) {
        // Show a toast notification that we're generating the avatar animation
        toast.info("Generating avatar animation...");
        
        const animationUrl = await createDIDAnimation(response, DID_API_KEY);
        if (animationUrl) {
          setVideoUrl(animationUrl);
        } else {
          toast.error("Failed to generate avatar animation");
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-10 flex flex-col items-center bg-slate-50">
      <div className="container max-w-6xl flex flex-col gap-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="chat">AI Health Assistant</TabsTrigger>
            <TabsTrigger value="care-form">Care Options</TabsTrigger>
          </TabsList>
          
          <TabsContent value="chat">
            <div className="w-full flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/2 flex flex-col gap-4">
                <ChatInterface
                  messages={messages}
                  isLoading={isLoading}
                  onSendMessage={handleSendMessage}
                />
                
                <Card>
                  <CardHeader>
                    <CardTitle>External Widget</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={() => setShowWidget(!showWidget)}
                      className="mb-4"
                    >
                      {showWidget ? 'Hide Widget' : 'Show Health Pro Assist Widget'}
                    </Button>
                    
                    {showWidget && <HealthProAssistWidget />}
                  </CardContent>
                </Card>
              </div>
              
              <div className="w-full md:w-1/2">
                <AvatarDisplay
                  isLoading={isLoading}
                  hasMessages={messages.length > 0}
                  videoUrl={videoUrl}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="care-form">
            <div className="w-full">
              <Card>
                <CardHeader>
                  <CardTitle>Find Senior Care Options</CardTitle>
                </CardHeader>
                <CardContent>
                  <EmbeddableCareForm 
                    initialParams={{
                      role: "family",
                      location: "San Francisco, CA"
                    }}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
