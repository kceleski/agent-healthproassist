import { Message } from '@/types/chat';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const ASSISTANT_ID = "asst_83MVmU8KUWFD8zsJOIVjh9i2";

interface OpenAIResponse {
  id: string;
  object: string;
  created_at: number;
  [key: string]: any;
}

/**
 * Creates a new OpenAI thread
 * @returns The thread ID
 */
export const createThread = async (): Promise<string> => {
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

    if (!response.ok) {
      throw new Error(`Failed to create thread: ${response.status}`);
    }

    const data: OpenAIResponse = await response.json();
    return data.id;
  } catch (error) {
    console.error('Error creating thread:', error);
    throw error;
  }
};

/**
 * Adds a message to an existing thread
 * @param threadId The thread ID
 * @param content The message content
 */
export const addMessageToThread = async (threadId: string, content: string): Promise<void> => {
  try {
    const response = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'OpenAI-Beta': 'assistants=v1'
      },
      body: JSON.stringify({
        role: 'user',
        content
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to add message: ${response.status}`);
    }
  } catch (error) {
    console.error('Error adding message to thread:', error);
    throw error;
  }
};

/**
 * Runs the assistant on a thread
 * @param threadId The thread ID
 * @returns The run ID
 */
export const runAssistant = async (threadId: string): Promise<string> => {
  try {
    const runResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'OpenAI-Beta': 'assistants=v1'
      },
      body: JSON.stringify({
        assistant_id: ASSISTANT_ID
      })
    });

    if (!runResponse.ok) {
      throw new Error(`Failed to run assistant: ${runResponse.status}`);
    }

    const runData: OpenAIResponse = await runResponse.json();
    return runData.id;
  } catch (error) {
    console.error('Error running assistant:', error);
    throw error;
  }
};

/**
 * Checks the status of a run
 * @param threadId The thread ID
 * @param runId The run ID
 * @returns The run status
 */
export const checkRunStatus = async (threadId: string, runId: string): Promise<string> => {
  try {
    const statusResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs/${runId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'OpenAI-Beta': 'assistants=v1'
      }
    });

    if (!statusResponse.ok) {
      throw new Error(`Failed to check run status: ${statusResponse.status}`);
    }

    const statusData = await statusResponse.json();
    return statusData.status;
  } catch (error) {
    console.error('Error checking run status:', error);
    throw error;
  }
};

/**
 * Gets all messages from a thread
 * @param threadId The thread ID
 * @returns Array of messages
 */
export const getThreadMessages = async (threadId: string): Promise<Message[]> => {
  try {
    const messagesResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'OpenAI-Beta': 'assistants=v1'
      }
    });

    if (!messagesResponse.ok) {
      throw new Error(`Failed to get messages: ${messagesResponse.status}`);
    }

    const messagesData = await messagesResponse.json();
    
    // Transform the OpenAI message format to our app's format
    return messagesData.data.map((message: any) => ({
      id: message.id,
      role: message.role,
      content: message.content[0].text.value
    })).reverse();
  } catch (error) {
    console.error('Error getting thread messages:', error);
    throw error;
  }
};

/**
 * Processes a user message through the OpenAI assistant
 * @param threadId The thread ID
 * @param message The user message
 * @returns Updated array of messages
 */
export const processUserMessage = async (threadId: string, message: string): Promise<Message[]> => {
  try {
    // Add the message to the thread
    await addMessageToThread(threadId, message);
    
    // Run the assistant
    const runId = await runAssistant(threadId);
    
    // Poll for completion
    let status = await checkRunStatus(threadId, runId);
    while (status !== 'completed' && status !== 'failed') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      status = await checkRunStatus(threadId, runId);
    }
    
    if (status === 'failed') {
      throw new Error('Assistant run failed');
    }
    
    // Get the updated messages
    return await getThreadMessages(threadId);
  } catch (error) {
    console.error('Error processing user message:', error);
    throw error;
  }
};