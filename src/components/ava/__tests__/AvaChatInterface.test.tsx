
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AvaChatInterface } from '../AvaChatInterface';

describe('AvaChatInterface', () => {
  const mockProps = {
    messages: [],
    isLoading: false,
    input: '',
    setInput: vi.fn(),
    onSendMessage: vi.fn(),
  };

  it('renders empty state correctly', () => {
    render(<AvaChatInterface {...mockProps} />);
    expect(screen.getByText('Start a conversation with Ava about finding senior care facilities')).toBeInTheDocument();
  });

  it('renders messages correctly', () => {
    const messages = [
      { role: 'user', content: 'Hello' },
      { role: 'assistant', content: 'Hi there!' },
    ];
    
    render(<AvaChatInterface {...mockProps} messages={messages} />);
    
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('Hi there!')).toBeInTheDocument();
  });

  it('handles input changes', async () => {
    const user = userEvent.setup();
    render(<AvaChatInterface {...mockProps} />);
    
    const input = screen.getByPlaceholder('Ask Ava about senior care facilities...');
    await user.type(input, 'Test message');
    
    expect(mockProps.setInput).toHaveBeenCalledTimes('Test message'.length);
  });

  it('handles send button click', () => {
    render(<AvaChatInterface {...mockProps} />);
    
    const sendButton = screen.getByRole('button', { name: 'Send' });
    fireEvent.click(sendButton);
    
    expect(mockProps.onSendMessage).toHaveBeenCalledTimes(1);
  });

  it('disables input and shows loading state when isLoading is true', () => {
    render(<AvaChatInterface {...mockProps} isLoading={true} />);
    
    const input = screen.getByPlaceholder('Ask Ava about senior care facilities...');
    const sendButton = screen.getByRole('button');
    
    expect(input).toBeDisabled();
    expect(sendButton).toBeDisabled();
    expect(screen.getByRole('img', { name: 'Loading spinner' })).toBeInTheDocument();
  });

  it('handles Enter key press', async () => {
    const user = userEvent.setup();
    render(<AvaChatInterface {...mockProps} />);
    
    const input = screen.getByPlaceholder('Ask Ava about senior care facilities...');
    await user.type(input, 'Test{Enter}');
    
    expect(mockProps.onSendMessage).toHaveBeenCalledTimes(1);
  });
});
