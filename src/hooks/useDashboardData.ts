
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  fetchDashboardStats,
  fetchRecentActivity,
  fetchDashboardNotifications,
  type DashboardStats,
  type ActivityItem,
  type NotificationItem
} from '@/services/dashboardService';

export function useDashboardData() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboardData() {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        console.log('[DASHBOARD] Loading data for user:', user.id);

        const [statsData, activityData, notificationsData] = await Promise.all([
          fetchDashboardStats(user.id),
          fetchRecentActivity(user.id),
          fetchDashboardNotifications(user.id)
        ]);

        console.log('[DASHBOARD] Data loaded:', { statsData, activityData, notificationsData });

        setStats(statsData);
        setActivity(activityData);
        setNotifications(notificationsData);
      } catch (err) {
        console.error('[DASHBOARD] Error loading data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, [user?.id]);

  const refresh = async () => {
    if (user?.id) {
      setLoading(true);
      try {
        const [statsData, activityData, notificationsData] = await Promise.all([
          fetchDashboardStats(user.id),
          fetchRecentActivity(user.id),
          fetchDashboardNotifications(user.id)
        ]);
        setStats(statsData);
        setActivity(activityData);
        setNotifications(notificationsData);
      } catch (err) {
        setError('Failed to refresh dashboard data');
      } finally {
        setLoading(false);
      }
    }
  };

  return {
    stats,
    activity,
    notifications,
    loading,
    error,
    refresh
  };
}
