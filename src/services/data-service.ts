/**
 * Data service for API calls and data gathering
 */
import { searchFacilities, LocationSearchResult } from './maps-service';

/**
 * Types of data that can be fetched
 */
export enum DataType {
  FACILITIES = 'facilities',
  CONTACTS = 'contacts',
  PAYMENTS = 'payments',
  CALENDAR = 'calendar',
}

/**
 * Interface for data request
 */
export interface DataRequest {
  type: DataType;
  query?: string;
  filters?: Record<string, any>;
  limit?: number;
}

/**
 * Interface for data response
 */
export interface DataResponse {
  type: DataType;
  data: any;
  summary: string;
  error?: string;
}

/**
 * Fetches data based on the request
 * @param request Data request
 * @returns Data response
 */
export const fetchData = async (request: DataRequest): Promise<DataResponse> => {
  try {
    switch (request.type) {
      case DataType.FACILITIES:
        return await fetchFacilitiesData(request);
      case DataType.CONTACTS:
        return await fetchContactsData(request);
      case DataType.PAYMENTS:
        return await fetchPaymentsData(request);
      case DataType.CALENDAR:
        return await fetchCalendarData(request);
      default:
        throw new Error(`Unknown data type: ${request.type}`);
    }
  } catch (error) {
    console.error(`Error fetching ${request.type} data:`, error);
    return {
      type: request.type,
      data: null,
      summary: `Error fetching ${request.type} data: ${error instanceof Error ? error.message : 'Unknown error'}`,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * Fetches facilities data
 * @param request Data request
 * @returns Data response
 */
const fetchFacilitiesData = async (request: DataRequest): Promise<DataResponse> => {
  const query = request.query || 'senior living facilities';
  const limit = request.limit || 5;
  
  const facilities = await searchFacilities(query);
  const limitedResults = facilities.slice(0, limit);
  
  // Generate a summary of the results
  const summary = generateFacilitiesSummary(limitedResults);
  
  return {
    type: DataType.FACILITIES,
    data: limitedResults,
    summary,
  };
};

/**
 * Generates a summary of facilities data
 * @param facilities Facilities data
 * @returns Summary text
 */
const generateFacilitiesSummary = (facilities: LocationSearchResult[]): string => {
  if (facilities.length === 0) {
    return 'No facilities found matching your criteria.';
  }
  
  const count = facilities.length;
  const topFacilities = facilities.slice(0, 3).map(f => f.name).join(', ');
  
  return `Found ${count} facilities. Top results include ${topFacilities}${count > 3 ? ' and more' : ''}.`;
};

/**
 * Fetches contacts data (mock implementation)
 * @param request Data request
 * @returns Data response
 */
const fetchContactsData = async (request: DataRequest): Promise<DataResponse> => {
  // Mock data for demonstration
  const contacts = [
    {
      id: 'contact1',
      name: 'John Smith',
      role: 'Facility Manager',
      email: 'john.smith@example.com',
      phone: '(555) 123-4567',
      facility: 'Sunrise Senior Living',
    },
    {
      id: 'contact2',
      name: 'Sarah Johnson',
      role: 'Admissions Director',
      email: 'sarah.johnson@example.com',
      phone: '(555) 987-6543',
      facility: 'Golden Oaks Care Center',
    },
    {
      id: 'contact3',
      name: 'Michael Brown',
      role: 'Care Coordinator',
      email: 'michael.brown@example.com',
      phone: '(555) 456-7890',
      facility: 'Meadow Ridge Assisted Living',
    },
  ];
  
  const summary = `Found ${contacts.length} contacts. Key contacts include ${contacts[0].name} (${contacts[0].role}) and ${contacts[1].name} (${contacts[1].role}).`;
  
  return {
    type: DataType.CONTACTS,
    data: contacts,
    summary,
  };
};

/**
 * Fetches payments data (mock implementation)
 * @param request Data request
 * @returns Data response
 */
const fetchPaymentsData = async (request: DataRequest): Promise<DataResponse> => {
  // Mock data for demonstration
  const payments = [
    {
      id: 'payment1',
      date: '2025-04-15',
      amount: 2500,
      facility: 'Sunrise Senior Living',
      resident: 'Alice Williams',
      status: 'Paid',
    },
    {
      id: 'payment2',
      date: '2025-04-10',
      amount: 3200,
      facility: 'Golden Oaks Care Center',
      resident: 'Robert Johnson',
      status: 'Pending',
    },
    {
      id: 'payment3',
      date: '2025-04-05',
      amount: 1800,
      facility: 'Meadow Ridge Assisted Living',
      resident: 'Carol Davis',
      status: 'Paid',
    },
  ];
  
  const totalPaid = payments.filter(p => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0);
  const totalPending = payments.filter(p => p.status === 'Pending').reduce((sum, p) => sum + p.amount, 0);
  
  const summary = `You have ${payments.length} recent payments. Total paid: $${totalPaid}. Total pending: $${totalPending}.`;
  
  return {
    type: DataType.PAYMENTS,
    data: payments,
    summary,
  };
};

/**
 * Fetches calendar data (mock implementation)
 * @param request Data request
 * @returns Data response
 */
const fetchCalendarData = async (request: DataRequest): Promise<DataResponse> => {
  // Mock data for demonstration
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);
  
  const events = [
    {
      id: 'event1',
      title: 'Tour at Sunrise Senior Living',
      date: today.toISOString().split('T')[0],
      time: '10:00 AM',
      location: 'Sunrise Senior Living',
      attendees: ['John Smith', 'Alice Williams'],
    },
    {
      id: 'event2',
      title: 'Client Meeting',
      date: tomorrow.toISOString().split('T')[0],
      time: '2:00 PM',
      location: 'Virtual',
      attendees: ['Robert Johnson', 'Sarah Johnson'],
    },
    {
      id: 'event3',
      title: 'Facility Assessment',
      date: nextWeek.toISOString().split('T')[0],
      time: '11:30 AM',
      location: 'Golden Oaks Care Center',
      attendees: ['Michael Brown', 'Carol Davis'],
    },
  ];
  
  const todayEvents = events.filter(e => e.date === today.toISOString().split('T')[0]);
  
  const summary = todayEvents.length > 0
    ? `You have ${todayEvents.length} events today, including ${todayEvents[0].title} at ${todayEvents[0].time}.`
    : `You have no events today. Your next event is ${events[1].title} tomorrow at ${events[1].time}.`;
  
  return {
    type: DataType.CALENDAR,
    data: events,
    summary,
  };
};