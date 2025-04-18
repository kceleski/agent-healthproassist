
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AvaAvatar } from '../AvaAvatar';

describe('AvaAvatar', () => {
  it('renders loading state correctly', () => {
    const videoRef = { current: null };
    render(<AvaAvatar isLoading={true} videoRef={videoRef} hasMessages={false} />);
    
    expect(screen.getByText('Processing your request...')).toBeInTheDocument();
    expect(screen.getByTestId('loading-spinner')).toHaveClass('animate-spin');
  });

  it('renders initial state with no messages', () => {
    const videoRef = { current: null };
    render(<AvaAvatar isLoading={false} videoRef={videoRef} hasMessages={false} />);
    
    expect(screen.getByText('Ava will appear here when you start chatting')).toBeInTheDocument();
  });

  it('renders video element when not loading and has messages', () => {
    const videoRef = { current: null };
    render(<AvaAvatar isLoading={false} videoRef={videoRef} hasMessages={true} />);
    
    const video = screen.getByRole('video');
    expect(video).toBeInTheDocument();
    expect(video).toHaveAttribute('autoPlay');
    expect(video).toHaveAttribute('playsInline');
  });
});
