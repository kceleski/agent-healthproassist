
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
    const mockSendMessage = vi.fn();
    const mockSetInput = vi.fn();
    
    render(
      <AvaChatInterface 
        messages={[]}
        input=""
        setInput={mockSetInput}
        onSendMessage={mockSendMessage}
        isLoading={false}
      />
    );
    
    expect(screen.getByText('Start a conversation with Ava about finding senior care facilities')).toBeInTheDocument();
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
        onSendMessage={vi.fn()}
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
        onSendMessage={vi.fn()}
        isLoading={false}
      />
    );
    
    const input = screen.getByPlaceholderText('Ask Ava about senior care facilities...');
    fireEvent.change(input, { target: { value: 'Hello' } });
    
    expect(mockSetInput).toHaveBeenCalledWith('Hello');
  });

  it('calls onSendMessage when Send button is clicked', () => {
    const mockSendMessage = vi.fn();
    
    render(
      <AvaChatInterface 
        messages={[]}
        input="Hello"
        setInput={vi.fn()}
        onSendMessage={mockSendMessage}
        isLoading={false}
      />
    );
    
    const button = screen.getByRole('button', { name: 'Send' });
    fireEvent.click(button);
    
    expect(mockSendMessage).toHaveBeenCalled();
  });

  it('calls onSendMessage when Enter key is pressed', () => {
    const mockSendMessage = vi.fn();
    
    render(
      <AvaChatInterface 
        messages={[]}
        input="Hello"
        setInput={vi.fn()}
        onSendMessage={mockSendMessage}
        isLoading={false}
      />
    );
    
    const input = screen.getByPlaceholderText('Ask Ava about senior care facilities...');
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    
    expect(mockSendMessage).toHaveBeenCalled();
  });

  it('renders loading state correctly', () => {
    render(
      <AvaChatInterface 
        messages={[]}
        input=""
        setInput={vi.fn()}
        onSendMessage={vi.fn()}
        isLoading={true}
      />
    );
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(screen.getByTestId('loading-spinner')).toHaveClass('animate-spin');
  });
});
