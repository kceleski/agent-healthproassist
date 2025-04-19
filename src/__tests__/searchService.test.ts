
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { saveSearchResult } from '@/services/searchService';
import { supabase } from '@/integrations/supabase/client';

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getUser: vi.fn(),
    },
    from: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    single: vi.fn(),
  },
}));

describe('searchService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should save search result when user is authenticated', async () => {
    // Mock authenticated user
    vi.mocked(supabase.auth.getUser).mockResolvedValue({
      data: { user: { id: 'test-user-id' } },
      error: null,
    } as any);

    // Mock successful insert
    vi.mocked(supabase.from).mockReturnValue({
      insert: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: { id: 'new-search-id' },
        error: null,
      }),
    } as any);

    const searchData = {
      query: 'Phoenix, AZ Memory Care',
      location: 'Phoenix, AZ',
      facility_type: 'memory_care',
      amenities: ['dining', 'transport'],
      results: [],
    };

    const result = await saveSearchResult(searchData);
    
    expect(supabase.auth.getUser).toHaveBeenCalled();
    expect(supabase.from).toHaveBeenCalledWith('search_results');
    expect(result).toEqual({ id: 'new-search-id' });
  });

  it('should return null when user is not authenticated', async () => {
    // Mock unauthenticated user
    vi.mocked(supabase.auth.getUser).mockResolvedValue({
      data: { user: null },
      error: null,
    } as any);

    const searchData = {
      query: 'Phoenix, AZ Memory Care',
      location: 'Phoenix, AZ',
      facility_type: 'memory_care',
      amenities: ['dining', 'transport'],
      results: [],
    };

    const result = await saveSearchResult(searchData);
    
    expect(supabase.auth.getUser).toHaveBeenCalled();
    expect(result).toBeNull();
  });

  it('should handle errors from Supabase', async () => {
    // Mock authenticated user
    vi.mocked(supabase.auth.getUser).mockResolvedValue({
      data: { user: { id: 'test-user-id' } },
      error: null,
    } as any);

    // Mock error from Supabase
    vi.mocked(supabase.from).mockReturnValue({
      insert: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: null,
        error: new Error('Database error'),
      }),
    } as any);

    const searchData = {
      query: 'Phoenix, AZ Memory Care',
      location: 'Phoenix, AZ',
      facility_type: 'memory_care',
      amenities: ['dining', 'transport'],
      results: [],
    };

    const result = await saveSearchResult(searchData);
    
    expect(supabase.auth.getUser).toHaveBeenCalled();
    expect(supabase.from).toHaveBeenCalledWith('search_results');
    expect(result).toBeNull();
  });
});
