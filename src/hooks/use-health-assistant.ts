
import { useState } from 'react';
import { toast } from 'sonner';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const useHealthAssistant = (threadId: string | null, OPENAI_API_KEY: string, ASSISTANT_ID: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentThreadId, setCurrentThreadId] = useState<string | null>(threadId);

  const createThread = async () => {
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
      setCurrentThreadId(data.id);
      localStorage.setItem('assistant_thread_id', data.id);
      return data.id;
    } catch (error) {
      console.error('Error creating thread:', error);
      toast.error('Failed to create OpenAI thread');
      return null;
    }
  };

  const sendMessage = async (input: string) => {
    if (!input.trim()) return;
    
    const threadId = currentThreadId || await createThread();
    if (!threadId) return;

    const userMessage = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
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
        
        setMessages(prev => [...prev, { role: 'assistant', content: assistantResponse }]);
        return assistantResponse;
      }
      return null;
    } catch (error) {
      console.error('Error in chat process:', error);
      toast.error('An error occurred while processing your message');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    isLoading,
    sendMessage
  };
};
