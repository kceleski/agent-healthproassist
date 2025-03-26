
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// Hardcoded API keys
const OPENAI_API_KEY = "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"; // Replace with your actual OpenAI API key
const DID_API_KEY = "your_did_api_key_here"; // Replace with your actual D-ID API key
const ASSISTANT_ID = "asst_83MVmU8KUWFD8zsJOIVjh9i2"; // Replace with your actual OpenAI Assistant ID

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Assistant thread management
  const [threadId, setThreadId] = useState<string | null>(localStorage.getItem('assistant_thread_id'));
  
  // Create a new thread if we don't have one
  useEffect(() => {
    const createThread = async () => {
      if (!threadId) {
        try {
          const response = await fetch('https://api.openai.com/v1/threads', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${OPENAI_API_KEY}`,
              'OpenAI-Beta': 'assistants=v1'
            },
            body: JSON.stringify({})
          });
          
          if (!response.ok) throw new Error('Failed to create thread');
          
          const data = await response.json();
          setThreadId(data.id);
          localStorage.setItem('assistant_thread_id', data.id);
        } catch (error) {
          console.error('Error creating thread:', error);
          toast.error('Failed to create OpenAI thread');
        }
      }
    };
    
    createThread();
  }, [threadId]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send message to OpenAI Assistant and animate the response with D-ID
  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Add user message to chat
    const userMessage = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // 1. Add message to OpenAI thread
      await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'OpenAI-Beta': 'assistants=v1'
        },
        body: JSON.stringify({
          role: 'user',
          content: input
        })
      });

      // 2. Run the assistant on the thread
      const runResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'OpenAI-Beta': 'assistants=v1'
        },
        body: JSON.stringify({
          assistant_id: ASSISTANT_ID,
        })
      });
      
      if (!runResponse.ok) throw new Error('Failed to run assistant');
      
      const runData = await runResponse.json();
      const runId = runData.id;
      
      // 3. Poll for completion
      let runStatus = 'in_progress';
      while (runStatus === 'in_progress' || runStatus === 'queued') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const statusResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs/${runId}`, {
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'OpenAI-Beta': 'assistants=v1'
          }
        });
        
        if (!statusResponse.ok) throw new Error('Failed to check run status');
        
        const statusData = await statusResponse.json();
        runStatus = statusData.status;
      }
      
      if (runStatus === 'completed') {
        // 4. Retrieve messages
        const messagesResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'OpenAI-Beta': 'assistants=v1'
          }
        });
        
        if (!messagesResponse.ok) throw new Error('Failed to retrieve messages');
        
        const messagesData = await messagesResponse.json();
        const lastMessage = messagesData.data[0];
        const assistantResponse = lastMessage.content[0].text.value;
        
        // 5. Send to D-ID for animation
        const didResponse = await fetch('https://api.d-id.com/talks', {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${DID_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            script: {
              type: 'text',
              input: assistantResponse,
              provider: {
                type: 'microsoft',
                voice_id: 'en-US-AriaNeural'
              }
            },
            source_url: 'https://create-images-results.d-id.com/DefaultPresenters/Erica_f/image.jpeg',
            config: { fluent: true, pad_audio: 0 }
          })
        });
        
        if (!didResponse.ok) throw new Error('Failed to create D-ID talk');
        
        const didData = await didResponse.json();
        
        // 6. Poll for D-ID result
        let didStatus = 'created';
        let resultUrl = '';
        
        while (didStatus !== 'done') {
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const didStatusResponse = await fetch(`https://api.d-id.com/talks/${didData.id}`, {
            headers: {
              'Authorization': `Basic ${DID_API_KEY}`,
            }
          });
          
          if (!didStatusResponse.ok) throw new Error('Failed to check D-ID status');
          
          const didStatusData = await didStatusResponse.json();
          didStatus = didStatusData.status;
          
          if (didStatus === 'done') {
            resultUrl = didStatusData.result_url;
          }
        }
        
        // 7. Add assistant message to chat and play video
        setMessages(prev => [...prev, { role: 'assistant', content: assistantResponse }]);
        
        if (videoRef.current && resultUrl) {
          videoRef.current.src = resultUrl;
          videoRef.current.play();
        }
      }
    } catch (error) {
      console.error('Error in chat process:', error);
      toast.error('An error occurred while processing your message');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-10 flex flex-col items-center bg-slate-50">
      <div className="container max-w-6xl flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/2 flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Health Assistant</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px] overflow-y-auto">
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    Start a conversation with your health assistant
                  </div>
                ) : (
                  messages.map((message, index) => (
                    <div 
                      key={index} 
                      className={`p-3 rounded-lg ${
                        message.role === 'user' 
                          ? 'bg-primary text-primary-foreground ml-12' 
                          : 'bg-muted mr-12'
                      }`}
                    >
                      {message.content}
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex items-center w-full gap-2">
                <Input
                  placeholder="Ask about your health..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                  disabled={isLoading}
                />
                <Button onClick={handleSendMessage} disabled={isLoading}>
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send'}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
        
        <div className="w-full md:w-1/2">
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
                <>
                  <video 
                    ref={videoRef}
                    className="w-full max-w-md rounded-lg shadow-lg"
                    controls
                    autoPlay
                    playsInline
                  />
                  {messages.length === 0 && (
                    <div className="mt-6 text-center text-muted-foreground">
                      Your assistant's video will appear here
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
