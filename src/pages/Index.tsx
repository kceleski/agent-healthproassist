
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

// Mock API keys for demo purposes - replace with environment variables
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || 'demo-key';
const ASSISTANT_ID = import.meta.env.VITE_ASSISTANT_ID || 'demo-assistant';

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
      if (!threadId && OPENAI_API_KEY !== 'demo-key') {
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

    // Demo mode - just add a mock response
    if (OPENAI_API_KEY === 'demo-key') {
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: 'This is a demo response. Please configure your OpenAI API key to use the real assistant.' 
        }]);
        setIsLoading(false);
      }, 1000);
      return;
    }

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
    <div className="min-h-screen w-full bg-slate-50">
      <Helmet>
        <title>HealthProAssist - AI Health Assistant</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              AI Health Assistant
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              Get personalized health guidance and support
            </p>
          </div>

          {/* Chat Interface */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">Chat with Your Assistant</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 md:h-96 overflow-y-auto border rounded-lg p-4 bg-white">
                <div className="space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      <p className="text-sm md:text-base">
                        Start a conversation with your health assistant
                      </p>
                    </div>
                  ) : (
                    messages.map((message, index) => (
                      <div 
                        key={index} 
                        className={`p-3 rounded-lg max-w-[80%] ${
                          message.role === 'user' 
                            ? 'bg-primary text-primary-foreground ml-auto' 
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm md:text-base break-words">
                          {message.content}
                        </p>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>
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
                  className="flex-1"
                />
                <Button 
                  onClick={handleSendMessage} 
                  disabled={isLoading}
                  className="px-4 py-2"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <span className="hidden sm:inline">Send</span>
                  )}
                  {!isLoading && <span className="sm:hidden">→</span>}
                </Button>
              </div>
            </CardFooter>
          </Card>
          
          {/* Widget Section */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">Health Pro Assist Widget</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={() => setShowWidget(!showWidget)}
                variant="outline"
                className="w-full sm:w-auto"
              >
                {showWidget ? 'Hide Widget' : 'Show Health Pro Assist Widget'}
              </Button>
              
              {showWidget && (
                <div className="border rounded-lg p-4 bg-white">
                  <HealthProAssistWidget />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
