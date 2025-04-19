
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SearchPage from '../pages/SearchPage';
import { supabase } from '@/integrations/supabase/client';

// Mock dependencies
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

vi.mock('@/hooks/useAISearch', () => ({
  useAISearch: () => ({
    sendMessage: vi.fn(),
    isConnected: true,
  }),
}));

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'test-user-id' } } }),
    },
    from: vi.fn().mockReturnValue({
      insert: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: {}, error: null }),
    }),
  },
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

describe('SearchPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  it('renders the search page with all expected elements', () => {
    render(
      <BrowserRouter>
        <SearchPage />
      </BrowserRouter>
    );

    // Check for main elements
    expect(screen.getByText('Search Senior Care Facilities')).toBeInTheDocument();
    expect(screen.getByText('AI-Assisted Search')).toBeInTheDocument();
    expect(screen.getByText('Search Criteria')).toBeInTheDocument();
    expect(screen.getByText('Search Tips')).toBeInTheDocument();
  });

  it('allows inputting location', () => {
    render(
      <BrowserRouter>
        <SearchPage />
      </BrowserRouter>
    );

    const locationInput = screen.getByLabelText('Location');
    fireEvent.change(locationInput, { target: { value: 'Seattle, WA' } });
    expect(locationInput.value).toBe('Seattle, WA');
  });

  it('allows selecting care type', () => {
    render(
      <BrowserRouter>
        <SearchPage />
      </BrowserRouter>
    );
    
    // Open the dropdown
    fireEvent.click(screen.getByText('Any Care Type'));
    
    // Select an option
    fireEvent.click(screen.getByText('Memory Care'));
    
    // Verify selection is displayed
    expect(screen.getByRole('combobox')).toHaveTextContent('Memory Care');
  });

  it('allows toggling amenities', () => {
    render(
      <BrowserRouter>
        <SearchPage />
      </BrowserRouter>
    );

    const checkbox = screen.getByLabelText('Fine Dining');
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    
    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it('saves search parameters to session storage when search is performed', () => {
    render(
      <BrowserRouter>
        <SearchPage />
      </BrowserRouter>
    );
    
    // Set location
    const locationInput = screen.getByLabelText('Location');
    fireEvent.change(locationInput, { target: { value: 'Seattle, WA' } });
    
    // Perform search
    const searchButton = screen.getByText('Search Facilities');
    fireEvent.click(searchButton);
    
    // Check session storage
    const storedParams = JSON.parse(sessionStorage.getItem('facilitySearchParams') || '{}');
    expect(storedParams.location).toBe('Seattle, WA');
  });
});
