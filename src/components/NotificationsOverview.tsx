
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, CheckCircle, AlertCircle } from 'lucide-react';
import { getUserNotifications, markNotificationAsRead } from '@/services/userService';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const NotificationsOverview = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadNotifications();
    } else {
      setNotifications([]);
      setLoading(false);
    }
  }, [user]);

  const loadNotifications = async () => {
    setLoading(true);
    if (user?.id) {
      const data = await getUserNotifications(user.id);
      setNotifications(data);
    }
    setLoading(false);
  };

  const handleMarkAsRead = async (notificationId: string) => {
    if (await markNotificationAsRead(notificationId)) {
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true } 
            : notification
        )
      );
    }
  };

  // For demo/testing purposes
  const createDummyNotification = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase.from('notifications').insert({
        user_id: user.id,
        type: 'system',
        title: 'Test Notification',
        content: 'This is a test notification created at ' + new Date().toLocaleTimeString(),
        read: false
      }).select();
      
      if (error) throw error;
      
      toast.success('Test notification created');
      loadNotifications();
    } catch (error) {
      console.error('Error creating test notification:', error);
      toast.error('Failed to create test notification');
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notifications
        </CardTitle>
        <div className="flex gap-2">
          {notifications.length > 0 && (
            <Button variant="outline" size="sm" onClick={loadNotifications}>
              Refresh
            </Button>
          )}
          <Button variant="secondary" size="sm" onClick={createDummyNotification}>
            Create Test Notification
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {notifications.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No new notifications
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div 
                key={notification.id}
                className={`p-4 rounded-md border ${notification.read ? 'bg-muted/30' : 'bg-muted/60'}`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{notification.title}</span>
                      {!notification.read && (
                        <Badge variant="default" className="bg-primary">New</Badge>
                      )}
                    </div>
                    <p className="mt-1 text-muted-foreground">
                      {notification.content}
                    </p>
                    <div className="mt-2 text-xs text-muted-foreground">
                      {new Date(notification.created_at).toLocaleString()}
                    </div>
                  </div>
                  {!notification.read && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleMarkAsRead(notification.id)}
                    >
                      <CheckCircle className="h-5 w-5" />
                      <span className="sr-only">Mark as read</span>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationsOverview;
