import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConversationalAIProvider, useConversationalAI } from '@/context/ConversationalAIContext';
import * as openaiService from '@/services/openai-service';
import * as didService from '@/services/did-service';
import * as dataService from '@/services/data-service';
import { DataType } from '@/services/data-service';

// Mock the services
vi.mock('@/services/openai-service', () => ({
  createThread: vi.fn(),
  processUserMessage: vi.fn(),
}));

vi.mock('@/services/did-service', () => ({
  animateResponse: vi.fn(),
}));

vi.mock('@/services/data-service', () => ({
  fetchData: vi.fn(),
  DataType: {
    FACILITIES: 'facilities',
    CONTACTS: 'contacts',
    PAYMENTS: 'payments',
    CALENDAR: 'calendar',
  },
}));

// Test component that uses the context
const TestComponent = () => {
  const { 
    messages, 
    isLoading, 
    sendMessage, 
    fetchDataFromAI, 
    clearMessages 
  } = useConversationalAI();
  
  return (
    <div>
      <div data-testid="messages">
        {messages.map((msg) => (
          <div key={msg.id} data-testid={`message-${msg.role}`}>
            {msg.content}
          </div>
        ))}
      </div>
      <div data-testid="loading">{isLoading ? 'Loading' : 'Not Loading'}</div>
      <button 
        data-testid="send-button" 
        onClick={() => sendMessage('Hello')}
      >
        Send Message
      </button>
      <button 
        data-testid="fetch-data-button" 
        onClick={() => fetchDataFromAI({ type: DataType.FACILITIES })}
      >
        Fetch Data
      </button>
      <button 
        data-testid="clear-button" 
        onClick={clearMessages}
      >
        Clear Messages
      </button>
    </div>
  );
};

describe('ConversationalAIContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock the createThread function to return a thread ID
    vi.mocked(openaiService.createThread).mockResolvedValue('thread-123');
  });
  
  it('should initialize with empty messages', async () => {
    render(
      <ConversationalAIProvider>
        <TestComponent />
      </ConversationalAIProvider>
    );
    
    // Verify that the messages array is empty
    const messagesElement = screen.getByTestId('messages');
    expect(messagesElement.children.length).toBe(0);
    
    // Verify that isLoading is false
    expect(screen.getByTestId('loading').textContent).toBe('Not Loading');
    
    // Verify that createThread was called
    await waitFor(() => {
      expect(openaiService.createThread).toHaveBeenCalled();
    });
  });
  
  it('should send a message and update the UI', async () => {
    // Mock the processUserMessage function to return messages
    vi.mocked(openaiService.processUserMessage).mockResolvedValue([
      { id: 'msg1', role: 'user', content: 'Hello' },
      { id: 'msg2', role: 'assistant', content: 'Hi there!' },
    ]);
    
    // Mock the animateResponse function to return a video URL
    vi.mocked(didService.animateResponse).mockResolvedValue('https://example.com/video.mp4');
    
    render(
      <ConversationalAIProvider>
        <TestComponent />
      </ConversationalAIProvider>
    );
    
    // Wait for the thread to be created
    await waitFor(() => {
      expect(openaiService.createThread).toHaveBeenCalled();
    });
    
    // Click the send button
    const sendButton = screen.getByTestId('send-button');
    await act(async () => {
      await userEvent.click(sendButton);
    });
    
    // Verify that isLoading becomes true
    expect(screen.getByTestId('loading').textContent).toBe('Loading');
    
    // Verify that processUserMessage was called with the correct parameters
    expect(openaiService.processUserMessage).toHaveBeenCalledWith('thread-123', 'Hello');
    
    // Wait for the messages to be updated
    await waitFor(() => {
      const userMessage = screen.getByTestId('message-user');
      const assistantMessage = screen.getByTestId('message-assistant');
      expect(userMessage.textContent).toBe('Hello');
      expect(assistantMessage.textContent).toBe('Hi there!');
    });
    
    // Verify that animateResponse was called with the correct parameters
    expect(didService.animateResponse).toHaveBeenCalledWith('Hi there!');
    
    // Verify that isLoading becomes false
    expect(screen.getByTestId('loading').textContent).toBe('Not Loading');
  });
  
  it('should fetch data and update the UI', async () => {
    // Mock the fetchData function to return data
    vi.mocked(dataService.fetchData).mockResolvedValue({
      type: DataType.FACILITIES,
      data: [{ id: 'facility1', name: 'Facility 1' }],
      summary: 'Found 1 facility',
    });
    
    // Mock the animateResponse function to return a video URL
    vi.mocked(didService.animateResponse).mockResolvedValue('https://example.com/video.mp4');
    
    render(
      <ConversationalAIProvider>
        <TestComponent />
      </ConversationalAIProvider>
    );
    
    // Wait for the thread to be created
    await waitFor(() => {
      expect(openaiService.createThread).toHaveBeenCalled();
    });
    
    // Click the fetch data button
    const fetchDataButton = screen.getByTestId('fetch-data-button');
    await act(async () => {
      await userEvent.click(fetchDataButton);
    });
    
    // Verify that isLoading becomes true
    expect(screen.getByTestId('loading').textContent).toBe('Loading');
    
    // Verify that fetchData was called with the correct parameters
    expect(dataService.fetchData).toHaveBeenCalledWith({ type: DataType.FACILITIES });
    
    // Wait for the messages to be updated
    await waitFor(() => {
      const assistantMessage = screen.getByTestId('message-assistant');
      expect(assistantMessage.textContent).toContain('Found 1 facility');
    });
    
    // Verify that animateResponse was called with the correct parameters
    expect(didService.animateResponse).toHaveBeenCalledWith(expect.stringContaining('Found 1 facility'));
    
    // Verify that isLoading becomes false
    expect(screen.getByTestId('loading').textContent).toBe('Not Loading');
  });
  
  it('should clear messages', async () => {
    // Mock the processUserMessage function to return messages
    vi.mocked(openaiService.processUserMessage).mockResolvedValue([
      { id: 'msg1', role: 'user', content: 'Hello' },
      { id: 'msg2', role: 'assistant', content: 'Hi there!' },
    ]);
    
    render(
      <ConversationalAIProvider>
        <TestComponent />
      </ConversationalAIProvider>
    );
    
    // Wait for the thread to be created
    await waitFor(() => {
      expect(openaiService.createThread).toHaveBeenCalled();
    });
    
    // Click the send button to add messages
    const sendButton = screen.getByTestId('send-button');
    await act(async () => {
      await userEvent.click(sendButton);
    });
    
    // Wait for the messages to be updated
    await waitFor(() => {
      const messagesElement = screen.getByTestId('messages');
      expect(messagesElement.children.length).toBe(2);
    });
    
    // Click the clear button
    const clearButton = screen.getByTestId('clear-button');
    await act(async () => {
      await userEvent.click(clearButton);
    });
    
    // Verify that the messages are cleared
    const messagesElement = screen.getByTestId('messages');
    expect(messagesElement.children.length).toBe(0);
  });
});