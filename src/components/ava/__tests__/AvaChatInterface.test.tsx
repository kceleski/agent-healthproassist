
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AvaChatInterface } from '../AvaChatInterface';

// Define the Message type to match what's expected in AvaChatInterface
interface Message {
  role: 'user' | 'assistant';
  content: string;
}

describe('AvaChatInterface', () => {
  it('renders empty state correctly', () => {
    const mockHandleSendMessage = vi.fn();
    const mockSetInput = vi.fn();
    
    render(
      <AvaChatInterface 
        messages={[]}
        input=""
        setInput={mockSetInput}
        handleSendMessage={mockHandleSendMessage}
        isLoading={false}
      />
    );
    
    expect(screen.getByText('Start a conversation with your health assistant')).toBeInTheDocument();
  });

  it('renders messages correctly', () => {
    const mockMessages: Message[] = [
      { role: 'user', content: 'Hello' },
      { role: 'assistant', content: 'How can I help you today?' },
    ];
    
    render(
      <AvaChatInterface 
        messages={mockMessages}
        input=""
        setInput={vi.fn()}
        handleSendMessage={vi.fn()}
        isLoading={false}
      />
    );
    
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('How can I help you today?')).toBeInTheDocument();
  });

  it('handles input change', () => {
    const mockSetInput = vi.fn();
    
    render(
      <AvaChatInterface 
        messages={[]}
        input="test"
        setInput={mockSetInput}
        handleSendMessage={vi.fn()}
        isLoading={false}
      />
    );
    
    const input = screen.getByPlaceholderText('Ask about your health...');
    fireEvent.change(input, { target: { value: 'Hello' } });
    
    expect(mockSetInput).toHaveBeenCalledWith('Hello');
  });

  it('calls handleSendMessage when Send button is clicked', () => {
    const mockHandleSendMessage = vi.fn();
    
    render(
      <AvaChatInterface 
        messages={[]}
        input="Hello"
        setInput={vi.fn()}
        handleSendMessage={mockHandleSendMessage}
        isLoading={false}
      />
    );
    
    const button = screen.getByRole('button', { name: 'Send' });
    fireEvent.click(button);
    
    expect(mockHandleSendMessage).toHaveBeenCalled();
  });

  it('calls handleSendMessage when Enter key is pressed', () => {
    const mockHandleSendMessage = vi.fn();
    
    render(
      <AvaChatInterface 
        messages={[]}
        input="Hello"
        setInput={vi.fn()}
        handleSendMessage={mockHandleSendMessage}
        isLoading={false}
      />
    );
    
    const input = screen.getByPlaceholderText('Ask about your health...');
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    
    expect(mockHandleSendMessage).toHaveBeenCalled();
  });

  it('renders loading state correctly', () => {
    render(
      <AvaChatInterface 
        messages={[]}
        input=""
        setInput={vi.fn()}
        handleSendMessage={vi.fn()}
        isLoading={true}
      />
    );
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(screen.getByRole('img', { hidden: true })).toHaveClass('animate-spin');
  });
});
