
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { saveSearchResult, SearchResultData } from '../services/searchService';
import { supabase } from '@/integrations/supabase/client';

// Mock the supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { 
          user: { id: 'test-user-id' } 
        }
      })
    },
    from: vi.fn(() => ({
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({
            data: { id: '123' },
            error: null
          })
        }))
      }))
    }))
  }
}));

describe('searchService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('saves search result to Supabase when user is authenticated', async () => {
    const testData: SearchResultData = {
      query: 'Test query',
      location: 'Phoenix, AZ',
      facility_type: 'assisted_living',
      amenities: ['dining', 'transport'],
      results: []
    };

    const result = await saveSearchResult(testData);
    
    expect(supabase.auth.getUser).toHaveBeenCalled();
    expect(supabase.from).toHaveBeenCalledWith('search_results');
    expect(result).toEqual({ id: '123' });
  });
});
