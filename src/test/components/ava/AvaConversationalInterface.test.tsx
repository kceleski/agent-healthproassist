import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AvaConversationalInterface from '@/components/ava/AvaConversationalInterface';
import { ConversationalAIProvider } from '@/context/ConversationalAIContext';
import * as openaiService from '@/services/openai-service';
import * as didService from '@/services/did-service';
import * as dataService from '@/services/data-service';

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

// Mock the SpeechRecognition API
const mockSpeechRecognition = {
  start: vi.fn(),
  stop: vi.fn(),
  onstart: null as any,
  onresult: null as any,
  onerror: null as any,
  onend: null as any,
};

// Mock the HTMLVideoElement
Object.defineProperty(window.HTMLVideoElement.prototype, 'play', {
  configurable: true,
  value: vi.fn().mockResolvedValue(undefined),
});

describe('AvaConversationalInterface', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock the createThread function to return a thread ID
    vi.mocked(openaiService.createThread).mockResolvedValue('thread-123');
    
    // Mock the SpeechRecognition API
    window.webkitSpeechRecognition = vi.fn().mockImplementation(() => mockSpeechRecognition);
  });
  
  it('should render the initial state correctly', async () => {
    render(
      <ConversationalAIProvider>
        <AvaConversationalInterface />
      </ConversationalAIProvider>
    );
    
    // Check that the header is rendered
    expect(screen.getByText('Ava - Healthcare Assistant')).toBeInTheDocument();
    
    // Check that the welcome message is rendered
    expect(screen.getByText("Hello, I'm Ava")).toBeInTheDocument();
    
    // Check that the quick action buttons are rendered
    expect(screen.getByText('Find facilities')).toBeInTheDocument();
    expect(screen.getByText('View contacts')).toBeInTheDocument();
    expect(screen.getByText('Check calendar')).toBeInTheDocument();
    expect(screen.getByText('View payments')).toBeInTheDocument();
  });
  
  it('should handle user input and display messages', async () => {
    // Mock the processUserMessage function to return messages
    vi.mocked(openaiService.processUserMessage).mockResolvedValue([
      { id: 'msg1', role: 'user', content: 'Hello' },
      { id: 'msg2', role: 'assistant', content: 'Hi there!' },
    ]);
    
    // Mock the animateResponse function to return a video URL
    vi.mocked(didService.animateResponse).mockResolvedValue('https://example.com/video.mp4');
    
    render(
      <ConversationalAIProvider>
        <AvaConversationalInterface />
      </ConversationalAIProvider>
    );
    
    // Wait for the thread to be created
    await waitFor(() => {
      expect(openaiService.createThread).toHaveBeenCalled();
    });
    
    // Type a message in the input field
    const inputField = screen.getByPlaceholderText('Type your message...');
    await userEvent.type(inputField, 'Hello');
    
    // Submit the form
    const sendButton = screen.getByRole('button', { name: /send/i });
    await act(async () => {
      await userEvent.click(sendButton);
    });
    
    // Verify that processUserMessage was called with the correct parameters
    expect(openaiService.processUserMessage).toHaveBeenCalledWith('thread-123', 'Hello');
    
    // Wait for the messages to be displayed
    await waitFor(() => {
      expect(screen.getByText('Hello')).toBeInTheDocument();
      expect(screen.getByText('Hi there!')).toBeInTheDocument();
    });
    
    // Verify that animateResponse was called with the correct parameters
    expect(didService.animateResponse).toHaveBeenCalledWith('Hi there!');
  });
  
  it('should handle voice input', async () => {
    render(
      <ConversationalAIProvider>
        <AvaConversationalInterface />
      </ConversationalAIProvider>
    );
    
    // Click the voice input button
    const voiceButton = screen.getByRole('button', { name: '' }); // Mic button has no text
    await userEvent.click(voiceButton);
    
    // Verify that the SpeechRecognition API was started
    expect(mockSpeechRecognition.start).toHaveBeenCalled();
    
    // Simulate a speech recognition result
    act(() => {
      mockSpeechRecognition.onstart();
      mockSpeechRecognition.onresult({
        results: [[{ transcript: 'Voice message' }]],
      });
      mockSpeechRecognition.onend();
    });
    
    // Verify that the input field was updated with the transcript
    const inputField = screen.getByPlaceholderText('Type your message...') as HTMLInputElement;
    expect(inputField.value).toBe('Voice message');
  });
  
  it('should handle data requests', async () => {
    // Mock the fetchData function to return data
    vi.mocked(dataService.fetchData).mockResolvedValue({
      type: 'facilities',
      data: [
        {
          id: 'facility1',
          name: 'Sunrise Senior Living',
          address: '123 Main St',
          rating: 4.5,
        },
      ],
      summary: 'Found 1 facility',
    });
    
    // Mock the animateResponse function to return a video URL
    vi.mocked(didService.animateResponse).mockResolvedValue('https://example.com/video.mp4');
    
    render(
      <ConversationalAIProvider>
        <AvaConversationalInterface />
      </ConversationalAIProvider>
    );
    
    // Wait for the thread to be created
    await waitFor(() => {
      expect(openaiService.createThread).toHaveBeenCalled();
    });
    
    // Click the "Find facilities" button
    const findFacilitiesButton = screen.getByText('Find facilities');
    await act(async () => {
      await userEvent.click(findFacilitiesButton);
    });
    
    // Verify that fetchData was called with the correct parameters
    expect(dataService.fetchData).toHaveBeenCalledWith(expect.objectContaining({
      type: 'facilities',
      query: 'senior living facilities near me',
    }));
    
    // Wait for the data to be displayed
    await waitFor(() => {
      expect(screen.getByText('Found 1 facility')).toBeInTheDocument();
      expect(screen.getByText('Sunrise Senior Living')).toBeInTheDocument();
      expect(screen.getByText('123 Main St')).toBeInTheDocument();
    });
    
    // Verify that animateResponse was called with the correct parameters
    expect(didService.animateResponse).toHaveBeenCalledWith(expect.stringContaining('Found 1 facility'));
  });
  
  it('should clear messages when the clear button is clicked', async () => {
    // Mock the processUserMessage function to return messages
    vi.mocked(openaiService.processUserMessage).mockResolvedValue([
      { id: 'msg1', role: 'user', content: 'Hello' },
      { id: 'msg2', role: 'assistant', content: 'Hi there!' },
    ]);
    
    render(
      <ConversationalAIProvider>
        <AvaConversationalInterface />
      </ConversationalAIProvider>
    );
    
    // Wait for the thread to be created
    await waitFor(() => {
      expect(openaiService.createThread).toHaveBeenCalled();
    });
    
    // Type and send a message
    const inputField = screen.getByPlaceholderText('Type your message...');
    await userEvent.type(inputField, 'Hello');
    
    const sendButton = screen.getByRole('button', { name: /send/i });
    await act(async () => {
      await userEvent.click(sendButton);
    });
    
    // Wait for the messages to be displayed
    await waitFor(() => {
      expect(screen.getByText('Hello')).toBeInTheDocument();
      expect(screen.getByText('Hi there!')).toBeInTheDocument();
    });
    
    // Click the clear button
    const clearButton = screen.getByRole('button', { name: /x/i });
    await act(async () => {
      await userEvent.click(clearButton);
    });
    
    // Verify that the welcome message is displayed again
    await waitFor(() => {
      expect(screen.getByText("Hello, I'm Ava")).toBeInTheDocument();
    });
  });
});