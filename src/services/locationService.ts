import { Location } from '../types/location';
import { supabase } from '../lib/supabase';

export async function getLocations(): Promise<Location[]> {
  try {
    // Option 1: Load from Supabase
    const { data, error } = await supabase
      .from('facilities')
      .select('*');
      
    if (error) throw error;
    
    // Transform data to match Location interface
    return data.map(facility => ({
      id: facility.id,
      name: facility.name,
      address: facility.address || '',
      city: facility.city || '',
      state: facility.state || '',
      zipCode: facility.zip_code || '',
      latitude: facility.latitude || 0,
      longitude: facility.longitude || 0,
      facilityType: facility.facility_type || [],
      careLevel: facility.care_level || [],
      rating: facility.rating || 0,
      priceRange: facility.price_range || '',
      amenities: facility.amenities || [],
      beds: facility.available_beds || 0,
      availability: facility.accepting_new_residents || false,
      imageUrl: facility.image_url,
      website: facility.website,
      phone: facility.phone,
      description: facility.description || ''
    }));
    
    // Option 2: If Supabase fails or for development, return mock data
    // return getMockLocations();
  } catch (error) {
    console.error('Error loading locations:', error);
    // Return mock data as fallback
    return getMockLocations();
  }
}

// Mock data for development and testing
function getMockLocations(): Location[] {
  return [
    {
      id: '1',
      name: 'Sunrise Senior Living',
      address: '123 Main St',
      city: 'Phoenix',
      state: 'AZ',
      zipCode: '85001',
      latitude: 33.4484,
      longitude: -112.0740,
      facilityType: ['Assisted Living', 'Memory Care'],
      careLevel: ['Medium Care', 'High Care'],
      rating: 4.5,
      priceRange: '$$$',
      amenities: ['Dining Services', 'Transportation', 'Activities', 'Wellness Programs'],
      beds: 5,
      availability: true,
      imageUrl: 'https://images.unsplash.com/photo-1571055107559-3e67626fa8be',
      website: 'https://example.com',
      phone: '(555) 123-4567',
      description: 'A premier senior living community offering personalized care services.',
      insurance: ['Medicare', 'Private Insurance', 'Long-term Care Insurance'],
      medicalNeeds: ['Medication Management', 'Wound Care', 'Diabetes Management']
    },
    {
      id: '2',
      name: 'Golden Years Retirement',
      address: '456 Oak Ave',
      city: 'Scottsdale',
      state: 'AZ',
      zipCode: '85251',
      latitude: 33.4942,
      longitude: -111.9261,
      facilityType: ['Independent Living'],
      careLevel: ['Low Care'],
      rating: 4.2,
      priceRange: '$$',
      amenities: ['Fitness Center', 'Pool', 'Library', 'Pet Friendly'],
      beds: 8,
      availability: true,
      imageUrl: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074',
      website: 'https://example.com',
      phone: '(555) 234-5678',
      description: 'Independent living community with resort-style amenities.',
      insurance: ['Private Insurance', 'Self-pay'],
      medicalNeeds: ['Wellness Checks']
    },
    {
      id: '3',
      name: 'Serenity Care Center',
      address: '789 Pine Blvd',
      city: 'Mesa',
      state: 'AZ',
      zipCode: '85201',
      latitude: 33.4152,
      longitude: -111.8315,
      facilityType: ['Skilled Nursing', 'Memory Care'],
      careLevel: ['High Care', 'Specialized Care'],
      rating: 4.7,
      priceRange: '$$$$',
      amenities: ['24/7 Nursing', 'Rehabilitation Services', 'Specialized Dining', 'Therapy Programs'],
      beds: 3,
      availability: false,
      imageUrl: 'https://images.unsplash.com/photo-1586105251261-72a756497a11',
      website: 'https://example.com',
      phone: '(555) 345-6789',
      description: 'Specialized care facility offering skilled nursing and memory care services.',
      insurance: ['Medicare', 'Medicaid', 'VA Benefits', 'Private Insurance'],
      medicalNeeds: ['Medication Management', 'Wound Care', 'Respiratory Care', 'Feeding Assistance']
    },
    {
      id: '4',
      name: 'Desert Bloom Senior Living',
      address: '101 Desert Rd',
      city: 'Tempe',
      state: 'AZ',
      zipCode: '85281',
      latitude: 33.4255,
      longitude: -111.9400,
      facilityType: ['Assisted Living'],
      careLevel: ['Medium Care'],
      rating: 4.0,
      priceRange: '$$',
      amenities: ['Dining Services', 'Transportation', 'Activities', 'Housekeeping'],
      beds: 10,
      availability: true,
      imageUrl: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7',
      website: 'https://example.com',
      phone: '(555) 456-7890',
      description: 'Comfortable assisted living community in the heart of Tempe.',
      insurance: ['Private Insurance', 'Long-term Care Insurance'],
      medicalNeeds: ['Medication Management', 'Mobility Assistance']
    },
    {
      id: '5',
      name: 'Harmony House',
      address: '202 Harmony Way',
      city: 'Glendale',
      state: 'AZ',
      zipCode: '85301',
      latitude: 33.5387,
      longitude: -112.1860,
      facilityType: ['Memory Care'],
      careLevel: ['Specialized Care'],
      rating: 4.8,
      priceRange: '$$$',
      amenities: ['Secure Environment', 'Memory Programs', 'Specialized Dining', 'Sensory Rooms'],
      beds: 2,
      availability: true,
      imageUrl: 'https://images.unsplash.com/photo-1541343672885-9be56236302a',
      website: 'https://example.com',
      phone: '(555) 567-8901',
      description: 'Specialized memory care facility with innovative programs.',
      insurance: ['Medicare', 'Private Insurance', 'Long-term Care Insurance'],
      medicalNeeds: ['Medication Management', 'Cognitive Support', 'Mobility Assistance']
    }
  ];
}