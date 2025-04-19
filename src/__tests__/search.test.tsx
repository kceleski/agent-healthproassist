
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SearchPage from '../pages/SearchPage';
import * as searchService from '../services/searchService';

// Mock the searchService
vi.mock('../services/searchService', () => ({
  saveSearchResult: vi.fn().mockResolvedValue({ id: '123' }),
}));

// Mock the react-router-dom hooks
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

// Mock the toast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe('SearchPage', () => {
  it('renders the search page with all components', () => {
    render(
      <BrowserRouter>
        <SearchPage />
      </BrowserRouter>
    );
    
    // Check that main components are rendered
    expect(screen.getByText('Search Senior Care Facilities')).toBeInTheDocument();
    expect(screen.getByText('Find the perfect facility by location, care type, and amenities')).toBeInTheDocument();
  });
  
  it('handles search submission correctly', async () => {
    render(
      <BrowserRouter>
        <SearchPage />
      </BrowserRouter>
    );
    
    // Find the search button and click it
    const searchButton = screen.getByRole('button', { name: /search/i });
    fireEvent.click(searchButton);
    
    // Check that saveSearchResult was called
    expect(searchService.saveSearchResult).toHaveBeenCalled();
  });
});
