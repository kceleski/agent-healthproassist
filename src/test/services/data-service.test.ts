import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchData, DataType } from '@/services/data-service';
import * as mapsService from '@/services/maps-service';

// Mock the maps service
vi.mock('@/services/maps-service', () => ({
  searchFacilities: vi.fn(),
}));

describe('Data Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchData', () => {
    it('should fetch facilities data', async () => {
      // Mock the searchFacilities function
      const mockFacilities = [
        {
          id: 'facility1',
          name: 'Sunrise Senior Living',
          address: '123 Main St, Anytown, USA',
          location: { lat: 37.7749, lng: -122.4194 },
          rating: 4.5,
        },
        {
          id: 'facility2',
          name: 'Golden Oaks Care Center',
          address: '456 Oak Ave, Somewhere, USA',
          location: { lat: 37.7749, lng: -122.4194 },
          rating: 4.2,
        },
      ];
      
      vi.mocked(mapsService.searchFacilities).mockResolvedValue(mockFacilities);
      
      // Call the function
      const result = await fetchData({
        type: DataType.FACILITIES,
        query: 'senior living',
        limit: 2,
      });
      
      // Verify the result
      expect(result.type).toBe(DataType.FACILITIES);
      expect(result.data).toEqual(mockFacilities);
      expect(result.summary).toContain('Found 2 facilities');
      expect(result.summary).toContain('Sunrise Senior Living');
      expect(result.summary).toContain('Golden Oaks Care Center');
      
      // Verify the searchFacilities was called with the correct parameters
      expect(mapsService.searchFacilities).toHaveBeenCalledWith('senior living');
    });
    
    it('should fetch contacts data', async () => {
      const result = await fetchData({
        type: DataType.CONTACTS,
      });
      
      expect(result.type).toBe(DataType.CONTACTS);
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.data.length).toBeGreaterThan(0);
      expect(result.summary).toContain('contacts');
    });
    
    it('should fetch payments data', async () => {
      const result = await fetchData({
        type: DataType.PAYMENTS,
      });
      
      expect(result.type).toBe(DataType.PAYMENTS);
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.data.length).toBeGreaterThan(0);
      expect(result.summary).toContain('payments');
      expect(result.summary).toContain('Total paid');
    });
    
    it('should fetch calendar data', async () => {
      const result = await fetchData({
        type: DataType.CALENDAR,
      });
      
      expect(result.type).toBe(DataType.CALENDAR);
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.data.length).toBeGreaterThan(0);
      expect(result.summary).toContain('events');
    });
    
    it('should handle errors', async () => {
      // Mock the searchFacilities function to throw an error
      vi.mocked(mapsService.searchFacilities).mockRejectedValue(new Error('API error'));
      
      // Call the function
      const result = await fetchData({
        type: DataType.FACILITIES,
        query: 'senior living',
      });
      
      // Verify the result
      expect(result.type).toBe(DataType.FACILITIES);
      expect(result.data).toBeNull();
      expect(result.error).toBe('API error');
      expect(result.summary).toContain('Error fetching facilities data');
    });
  });
});