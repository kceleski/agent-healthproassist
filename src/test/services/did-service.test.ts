import { describe, it, expect, vi, beforeEach } from 'vitest';
import { animateResponse, createDIDTalk, checkDIDTalkStatus } from '@/services/did-service';

// Mock fetch
global.fetch = vi.fn();

describe('DID Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createDIDTalk', () => {
    it('should create a DID talk successfully', async () => {
      // Mock the fetch response
      const mockResponse = {
        id: 'talk-123',
        status: 'created',
      };
      
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });
      
      // Call the function
      const result = await createDIDTalk('Hello, how are you?', 'https://example.com/image.jpg');
      
      // Verify the result
      expect(result).toEqual(mockResponse);
      
      // Verify fetch was called with the correct parameters
      expect(global.fetch).toHaveBeenCalledWith('https://api.d-id.com/talks', expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Authorization': expect.stringContaining('Basic '),
          'Content-Type': 'application/json',
        }),
        body: expect.stringContaining('Hello, how are you?'),
      }));
    });
    
    it('should handle errors', async () => {
      // Mock the fetch response to fail
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 400,
      });
      
      // Call the function and expect it to throw
      await expect(createDIDTalk('Hello', 'https://example.com/image.jpg'))
        .rejects.toThrow('Failed to create D-ID talk: 400');
    });
  });
  
  describe('checkDIDTalkStatus', () => {
    it('should check talk status successfully', async () => {
      // Mock the fetch response
      const mockResponse = {
        id: 'talk-123',
        status: 'done',
        result_url: 'https://example.com/video.mp4',
      };
      
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });
      
      // Call the function
      const result = await checkDIDTalkStatus('talk-123');
      
      // Verify the result
      expect(result).toEqual(mockResponse);
      
      // Verify fetch was called with the correct parameters
      expect(global.fetch).toHaveBeenCalledWith('https://api.d-id.com/talks/talk-123', expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          'Authorization': expect.stringContaining('Basic '),
        }),
      }));
    });
    
    it('should handle errors', async () => {
      // Mock the fetch response to fail
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404,
      });
      
      // Call the function and expect it to throw
      await expect(checkDIDTalkStatus('talk-123'))
        .rejects.toThrow('Failed to check D-ID status: 404');
    });
  });
  
  describe('animateResponse', () => {
    it('should animate a response successfully', async () => {
      // Mock the createDIDTalk and checkDIDTalkStatus functions
      const mockTalkResponse = {
        id: 'talk-123',
        status: 'created',
      };
      
      const mockStatusResponse = {
        id: 'talk-123',
        status: 'done',
        result_url: 'https://example.com/video.mp4',
      };
      
      // First call for createDIDTalk
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockTalkResponse,
      });
      
      // Second call for checkDIDTalkStatus
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockStatusResponse,
      });
      
      // Call the function
      const result = await animateResponse('Hello, how are you?');
      
      // Verify the result
      expect(result).toBe('https://example.com/video.mp4');
      
      // Verify fetch was called twice
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
    
    it('should handle errors in createDIDTalk', async () => {
      // Mock the fetch response to fail
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 400,
      });
      
      // Call the function and expect it to throw
      await expect(animateResponse('Hello'))
        .rejects.toThrow('Failed to create D-ID talk: 400');
    });
  });
});