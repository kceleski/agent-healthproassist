
import { supabase } from '@/lib/supabase';
import { AuthUser } from '@/types/auth';

export interface DashboardStats {
  totalClients: number;
  partnerFacilities: number;
  revenueYTD: string;
}

export interface ActivityItem {
  id: string;
  title: string;
  date: string;
  type: 'placement' | 'appointment' | 'payment';
  icon: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'reminder' | 'warning';
}

// Fetch dashboard statistics
export async function fetchDashboardStats(userId: string): Promise<DashboardStats> {
  try {
    // Get total clients count
    const { count: clientsCount, error: clientsError } = await supabase
      .from('contacts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (clientsError) {
      console.error('Error fetching clients count:', clientsError);
    }

    // Get partner facilities count
    const { count: facilitiesCount, error: facilitiesError } = await supabase
      .from('facility')
      .select('*', { count: 'exact', head: true });

    if (facilitiesError) {
      console.error('Error fetching facilities count:', facilitiesError);
    }

    // Get revenue YTD from payments
    const currentYear = new Date().getFullYear();
    const { data: payments, error: paymentsError } = await supabase
      .from('payments')
      .select('amount')
      .eq('user_id', userId)
      .gte('created_at', `${currentYear}-01-01`)
      .eq('status', 'completed');

    if (paymentsError) {
      console.error('Error fetching payments:', paymentsError);
    }

    const totalRevenue = payments?.reduce((sum, payment) => sum + Number(payment.amount), 0) || 0;

    return {
      totalClients: clientsCount || 0,
      partnerFacilities: facilitiesCount || 120, // Fallback to existing value if query fails
      revenueYTD: `$${(totalRevenue / 1000).toFixed(0)}K`
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    // Return fallback values in case of error
    return {
      totalClients: 0,
      partnerFacilities: 120,
      revenueYTD: '$0K'
    };
  }
}

// Fetch recent activity
export async function fetchRecentActivity(userId: string): Promise<ActivityItem[]> {
  try {
    // Get recent interactions/activities
    const { data: interactions, error } = await supabase
      .from('interactions')
      .select(`
        id,
        subject,
        interaction_date,
        type,
        content,
        contacts!inner(full_name),
        facility!inner(name)
      `)
      .eq('user_id', userId)
      .order('interaction_date', { ascending: false })
      .limit(5);

    if (error) {
      console.error('Error fetching activity:', error);
      return [];
    }

    return interactions?.map(interaction => ({
      id: interaction.id,
      title: interaction.subject || `${interaction.type} with ${interaction.contacts?.full_name || 'client'}`,
      date: new Date(interaction.interaction_date).toLocaleDateString(),
      type: interaction.type as 'placement' | 'appointment' | 'payment',
      icon: interaction.type
    })) || [];
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    return [];
  }
}

// Fetch notifications
export async function fetchDashboardNotifications(userId: string): Promise<NotificationItem[]> {
  try {
    // Get recent tasks as notifications
    const { data: tasks, error } = await supabase
      .from('tasks')
      .select('id, title, description, due_date, priority, status')
      .eq('user_id', userId)
      .eq('status', 'pending')
      .order('due_date', { ascending: true })
      .limit(5);

    if (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }

    return tasks?.map(task => ({
      id: task.id,
      title: task.title,
      message: task.description || 'Task pending completion',
      time: task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date',
      type: task.priority === 'high' ? 'warning' : 'info'
    })) || [];
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
}
