import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Helmet } from 'react-helmet';
import HealthProAssistWidget from '@/components/HealthProAssistWidget';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// API keys
const OPENAI_API_KEY = "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";
const ASSISTANT_ID = "asst_83MVmU8KUWFD8zsJOIVjh9i2";

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showWidget, setShowWidget] = useState(false);

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

  // Send message to OpenAI Assistant
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
        
        // 5. Add assistant message to chat
        setMessages(prev => [...prev, { role: 'assistant', content: assistantResponse }]);
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
        {/* Chat Interface */}
        <div className="w-full flex flex-col gap-4">
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
      </div>
    </div>
  );
};

export default Index;
