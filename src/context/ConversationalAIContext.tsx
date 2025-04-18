import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { createThread, processUserMessage } from '@/services/openai-service';
import { animateResponse } from '@/services/did-service';
import { fetchData, DataRequest, DataResponse, DataType } from '@/services/data-service';
import { Message } from '@/types/chat';

interface ConversationalAIContextType {
  messages: Message[];
  isLoading: boolean;
  isAnimating: boolean;
  currentVideoUrl: string | null;
  dataResults: DataResponse | null;
  sendMessage: (content: string) => Promise<void>;
  fetchDataFromAI: (request: DataRequest) => Promise<void>;
  clearMessages: () => void;
}

const ConversationalAIContext = createContext<ConversationalAIContextType | undefined>(undefined);

export const ConversationalAIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [threadId, setThreadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null);
  const [dataResults, setDataResults] = useState<DataResponse | null>(null);

  // Initialize thread on component mount
  useEffect(() => {
    const initThread = async () => {
      try {
        const id = await createThread();
        setThreadId(id);
        console.log('Thread created:', id);
      } catch (error) {
        console.error('Error initializing thread:', error);
      }
    };

    initThread();
  }, []);

  // Function to send a message to the AI
  const sendMessage = useCallback(async (content: string) => {
    if (!threadId) {
      console.error('Thread not initialized');
      return;
    }

    try {
      setIsLoading(true);
      
      // Add user message to the UI immediately
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: 'user',
        content
      };
      
      setMessages(prev => [...prev, userMessage]);

      // Process the message with OpenAI
      const updatedMessages = await processUserMessage(threadId, content);
      setMessages(updatedMessages);

      // Get the latest assistant message
      const assistantMessage = updatedMessages.find(m => m.role === 'assistant');
      
      if (assistantMessage) {
        // Animate the response with D-ID
        setIsAnimating(true);
        const videoUrl = await animateResponse(assistantMessage.content);
        setCurrentVideoUrl(videoUrl);
        setIsAnimating(false);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'I apologize, but I encountered an error processing your request. Please try again.'
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [threadId]);

  // Function to fetch data based on AI conversation
  const fetchDataFromAI = useCallback(async (request: DataRequest) => {
    try {
      setIsLoading(true);
      
      // Fetch the data
      const response = await fetchData(request);
      setDataResults(response);
      
      // Create a message about the data
      const dataMessage: Message = {
        id: `data-${Date.now()}`,
        role: 'assistant',
        content: `Here's what I found: ${response.summary}`
      };
      
      setMessages(prev => [...prev, dataMessage]);
      
      // Animate the response with D-ID
      setIsAnimating(true);
      const videoUrl = await animateResponse(dataMessage.content);
      setCurrentVideoUrl(videoUrl);
      setIsAnimating(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'I apologize, but I encountered an error retrieving that information. Please try again.'
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Function to clear messages
  const clearMessages = useCallback(() => {
    setMessages([]);
    setDataResults(null);
    setCurrentVideoUrl(null);
  }, []);

  return (
    <ConversationalAIContext.Provider
      value={{
        messages,
        isLoading,
        isAnimating,
        currentVideoUrl,
        dataResults,
        sendMessage,
        fetchDataFromAI,
        clearMessages
      }}
    >
      {children}
    </ConversationalAIContext.Provider>
  );
};

export const useConversationalAI = () => {
  const context = useContext(ConversationalAIContext);
  if (context === undefined) {
    throw new Error('useConversationalAI must be used within a ConversationalAIProvider');
  }
  return context;
};