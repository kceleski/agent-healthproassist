import { supabase } from '@/lib/supabase';

export interface DashboardStats {
  totalClients: number;
  partnerFacilities: number;
  revenueYTD: string;
}

export interface ActivityItem {
  id: string;
  title: string;
  date: string;
  type: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export const fetchDashboardStats = async (userId: string): Promise<DashboardStats> => {
  try {
    // Get total clients
    const { count: clientCount } = await supabase
      .from('clients')
      .select('*', { count: 'exact', head: true })
      .eq('agency_id', userId);

    // Get partner facilities count
    const { count: facilityCount } = await supabase
      .from('facility')
      .select('*', { count: 'exact', head: true })
      .eq('is_verified', true);

    // Get revenue from placements
    const { data: placements } = await supabase
      .from('placements')
      .select('commission_amount')
      .eq('agent_id', userId)
      .eq('commission_status', 'paid');

    const totalRevenue = placements?.reduce((sum, placement) => 
      sum + (placement.commission_amount || 0), 0) || 0;

    return {
      totalClients: clientCount || 0,
      partnerFacilities: facilityCount || 0,
      revenueYTD: `$${totalRevenue.toLocaleString()}`
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      totalClients: 0,
      partnerFacilities: 0,
      revenueYTD: '$0'
    };
  }
};

export const fetchRecentActivity = async (userId: string): Promise<ActivityItem[]> => {
  try {
    const { data: interactions } = await supabase
      .from('interactions')
      .select('id, type, subject, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    return interactions?.map(interaction => ({
      id: interaction.id,
      title: interaction.subject || `${interaction.type} interaction`,
      date: new Date(interaction.created_at).toLocaleDateString(),
      type: interaction.type
    })) || [];
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    return [];
  }
};

export const fetchDashboardNotifications = async (userId: string): Promise<NotificationItem[]> => {
  try {
    // For now, return mock data since there's no notifications table
    // This can be updated when the notifications system is implemented
    return [
      {
        id: '1',
        title: 'New referral received',
        message: 'You have a new client referral to review',
        time: '2 hours ago',
        read: false
      },
      {
        id: '2',
        title: 'Facility tour scheduled',
        message: 'Tour scheduled for tomorrow at 2 PM',
        time: '1 day ago',
        read: false
      }
    ];
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
};

// Keep backward compatibility
export const getDashboardStats = fetchDashboardStats;
export const getRecentActivity = fetchRecentActivity;
export const getNotifications = fetchDashboardNotifications;

export const getContacts = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('contacts')
      .select('id, full_name, email, phone, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) throw error;
    
    return data?.map(contact => ({
      id: contact.id,
      name: contact.full_name,
      email: contact.email,
      phone: contact.phone,
      created_at: contact.created_at
    })) || [];
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return [];
  }
};
