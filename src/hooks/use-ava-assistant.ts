
import { useState } from 'react';
import { toast } from 'sonner';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const ASSISTANT_ID = "asst_83MVmU8KUWFD8zsJOIVjh9i2";

export const useAvaAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(localStorage.getItem('assistant_thread_id'));

  const createThread = async () => {
    if (!threadId) {
      try {
        const response = await fetch('https://api.openai.com/v1/threads', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'OpenAI-Beta': 'assistants=v2'
          },
          body: JSON.stringify({})
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Failed to create thread: ${errorData.error?.message || 'Unknown error'}`);
        }
        
        const data = await response.json();
        setThreadId(data.id);
        localStorage.setItem('assistant_thread_id', data.id);
      } catch (error) {
        console.error('Error creating thread:', error);
        toast.error('Failed to create OpenAI thread');
      }
    }
  };

  const sendMessage = async (input: string) => {
    if (!threadId) {
      await createThread();
    }

    setIsLoading(true);
    const userMessage = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);

    try {
      await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'OpenAI-Beta': 'assistants=v2'
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
          'OpenAI-Beta': 'assistants=v2'
        },
        body: JSON.stringify({
          assistant_id: ASSISTANT_ID,
          instructions: "You are Ava, a helpful assistant for senior care. You can help users find senior care facilities on the interactive map."
        })
      });
      
      if (!runResponse.ok) {
        throw new Error('Failed to run assistant');
      }
      
      const runData = await runResponse.json();
      
      let runStatus = 'in_progress';
      while (runStatus === 'in_progress' || runStatus === 'queued') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const statusResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs/${runData.id}`, {
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'OpenAI-Beta': 'assistants=v2'
          }
        });
        
        if (!statusResponse.ok) {
          throw new Error('Failed to check run status');
        }
        
        const statusData = await statusResponse.json();
        runStatus = statusData.status;
      }
      
      if (runStatus === 'completed') {
        const messagesResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'OpenAI-Beta': 'assistants=v2'
          }
        });
        
        if (!messagesResponse.ok) {
          throw new Error('Failed to retrieve messages');
        }
        
        const messagesData = await messagesResponse.json();
        const lastMessage = messagesData.data[0];
        const assistantResponse = lastMessage.content[0].text?.value || 'I apologize, but I couldn\'t process your request at this time.';
        
        setMessages(prev => [...prev, { role: 'assistant', content: assistantResponse }]);
        return assistantResponse;
      } else {
        throw new Error(`Assistant run failed with status: ${runStatus}`);
      }
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
    sendMessage,
    createThread
  };
};
