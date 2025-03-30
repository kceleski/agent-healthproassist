
import { toast } from "sonner";

// Base API URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://healthproassist-api.example.com';

/**
 * Make an API request with standardized error handling
 */
export const apiRequest = async (
  method: 'GET' | 'POST' | 'PUT' | 'DELETE', 
  endpoint: string, 
  data?: any
): Promise<Response> => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Include cookies for auth
  };

  // Add body for POST/PUT requests
  if (data && (method === 'POST' || method === 'PUT')) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      // Handle different error status codes
      if (response.status === 401) {
        toast.error('Please log in to continue');
        // Could redirect to login page here
      } else if (response.status === 403) {
        toast.error('You do not have permission to perform this action');
      } else if (response.status === 404) {
        toast.error('The requested resource was not found');
      } else if (response.status >= 500) {
        toast.error('Server error. Please try again later.');
      } else {
        // Try to get error message from response
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.message || 'An error occurred');
      }
    }
    
    return response;
  } catch (error) {
    console.error('API request failed:', error);
    toast.error('Network error. Please check your connection and try again.');
    throw error;
  }
};

/**
 * Mock API functions for development and testing
 */
export const mockApiRequest = async (
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  endpoint: string,
  data?: any
): Promise<Response> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock responses based on endpoint
  if (endpoint.startsWith('/api/facilities/search')) {
    return new Response(JSON.stringify({
      facilities: [
        {
          id: 1,
          name: "Sunset Senior Living",
          address: "123 Main St",
          city: "San Francisco",
          state: "CA",
          zipCode: "94107",
          phoneNumber: "(415) 555-1234",
          website: "www.sunsetseniorliving.com",
          careTypes: ["assisted_living", "memory_care"],
          paymentMethods: ["private_pay", "long_term_care_insurance"],
          amenities: ["24/7 Staff", "Dining Services", "Transportation"],
          rating: 4.5,
          costRange: "$4,500 - $6,800 per month",
          description: "Luxury senior living with personalized care services in a beautiful environment.",
          imageUrl: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&auto=format&fit=crop"
        },
        {
          id: 2,
          name: "Golden Years Home",
          address: "456 Oak St",
          city: "Oakland",
          state: "CA",
          zipCode: "94610",
          phoneNumber: "(510) 555-6789",
          website: "www.goldenyearshome.com",
          careTypes: ["memory_care", "nursing_home"],
          paymentMethods: ["private_pay", "medicare", "medicaid"],
          amenities: ["Specialized Memory Care", "Rehabilitation Services", "Garden Areas"],
          rating: 4.2,
          costRange: "$5,200 - $7,500 per month",
          description: "Specialized memory care facility with compassionate staff and therapeutic programs.",
          imageUrl: "https://images.unsplash.com/photo-1547586696-ea22b4d4235d?w=600&auto=format&fit=crop"
        }
      ]
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }
  
  if (endpoint.match(/\/api\/facilities\/\d+/)) {
    const facilityId = parseInt(endpoint.split('/').pop() || '0');
    
    return new Response(JSON.stringify({
      id: facilityId,
      name: facilityId === 1 ? "Sunset Senior Living" : "Golden Years Home",
      address: facilityId === 1 ? "123 Main St" : "456 Oak St",
      city: facilityId === 1 ? "San Francisco" : "Oakland",
      state: "CA",
      zipCode: facilityId === 1 ? "94107" : "94610",
      phoneNumber: facilityId === 1 ? "(415) 555-1234" : "(510) 555-6789",
      website: facilityId === 1 ? "www.sunsetseniorliving.com" : "www.goldenyearshome.com",
      careTypes: facilityId === 1 ? ["assisted_living", "memory_care"] : ["memory_care", "nursing_home"],
      paymentMethods: facilityId === 1 ? ["private_pay", "long_term_care_insurance"] : ["private_pay", "medicare", "medicaid"],
      amenities: facilityId === 1 ? 
        ["24/7 Staff", "Dining Services", "Transportation", "Wellness Programs", "Social Activities"] : 
        ["Specialized Memory Care", "Rehabilitation Services", "Garden Areas", "Therapy Programs", "Secured Environment"],
      rating: facilityId === 1 ? 4.5 : 4.2,
      costRange: facilityId === 1 ? "$4,500 - $6,800 per month" : "$5,200 - $7,500 per month",
      description: facilityId === 1 ? 
        "Luxury senior living with personalized care services in a beautiful environment. Our community offers spacious apartments, fine dining, and a variety of social and recreational activities to keep residents engaged and fulfilled." : 
        "Specialized memory care facility with compassionate staff and therapeutic programs. We provide a secure, supportive environment for those with Alzheimer's and other forms of dementia, with activities designed to enhance cognitive function and quality of life.",
      imageUrl: facilityId === 1 ? 
        "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&auto=format&fit=crop" : 
        "https://images.unsplash.com/photo-1547586696-ea22b4d4235d?w=600&auto=format&fit=crop"
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }
  
  // Default fallback
  return new Response(JSON.stringify({ message: 'Not implemented in mock API' }), { 
    status: 501, 
    headers: { 'Content-Type': 'application/json' } 
  });
};

// Use mock API in development
export const useApiRequest = process.env.NODE_ENV === 'development' ? mockApiRequest : apiRequest;
