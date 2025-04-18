
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CalendarProvider, CalendarSync as CalendarSyncType, connectCalendarProvider, disconnectCalendarProvider, getConnectedCalendars } from "@/services/calendarSyncService";
import { useAuth } from "@/context/AuthContext";
import { Calendar as CalendarIcon, Check, Link2, Loader2 } from "lucide-react";

const CalendarSync = () => {
  const { user } = useAuth();
  const [connectedCalendars, setConnectedCalendars] = useState<CalendarSyncType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState<CalendarProvider | null>(null);

  useEffect(() => {
    if (user?.id) {
      loadConnectedCalendars();
    }
  }, [user]);

  const loadConnectedCalendars = async () => {
    setIsLoading(true);
    try {
      if (!user?.id) return;
      
      const calendars = await getConnectedCalendars(user.id);
      setConnectedCalendars(calendars);
    } catch (error) {
      console.error("Error loading connected calendars:", error);
      toast.error("Failed to load connected calendars");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async (provider: CalendarProvider) => {
    if (!user?.id) {
      toast.error("User not authenticated");
      return;
    }

    setIsConnecting(provider);
    try {
      // In a real implementation, this would initiate an OAuth flow
      const success = await connectCalendarProvider(user.id, provider);
      
      if (success) {
        toast.success(`Connected to ${provider.charAt(0).toUpperCase() + provider.slice(1)} Calendar`);
        await loadConnectedCalendars();
      } else {
        toast.error(`Failed to connect to ${provider} calendar`);
      }
    } catch (error) {
      console.error(`Error connecting ${provider} calendar:`, error);
      toast.error(`Failed to connect to ${provider} calendar`);
    } finally {
      setIsConnecting(null);
    }
  };

  const handleDisconnect = async (id: string, provider: CalendarProvider) => {
    try {
      await disconnectCalendarProvider(id);
      toast.success(`Disconnected from ${provider.charAt(0).toUpperCase() + provider.slice(1)} Calendar`);
      await loadConnectedCalendars();
    } catch (error) {
      console.error("Error disconnecting calendar:", error);
      toast.error("Failed to disconnect calendar");
    }
  };

  const isConnected = (provider: CalendarProvider) => {
    return connectedCalendars.some(c => c.provider === provider && c.connected);
  };

  const getConnectedId = (provider: CalendarProvider) => {
    return connectedCalendars.find(c => c.provider === provider && c.connected)?.id;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium flex items-center gap-2">
        <Link2 className="h-5 w-5 text-healthcare-600" />
        External Calendar Sync
      </h3>
      
      {isLoading ? (
        <div className="flex justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21.56 2H17V1a1 1 0 0 0-1-1h-8a1 1 0 0 0-1 1v1H2.44A1.43 1.43 0 0 0 1 3.44v18.12A1.43 1.43 0 0 0 2.44 23h19.12a1.43 1.43 0 0 0 1.44-1.44V3.44A1.43 1.43 0 0 0 21.56 2zm-10.06 0h1v3h-1zm0 5h1v1h-1zm0 3h1v1h-1zm0 3h1v1h-1zm0 3h1v1h-1zm-7.5-9h16v9h-16z"/>
                </svg>
              </div>
              <div>
                <h4 className="font-medium">Google Calendar</h4>
                <p className="text-sm text-muted-foreground">
                  {isConnected('google') ? 'Connected' : 'Not connected'}
                </p>
              </div>
            </div>
            {isConnected('google') ? (
              <Button 
                variant="outline" 
                onClick={() => handleDisconnect(getConnectedId('google') as string, 'google')}
              >
                Disconnect
              </Button>
            ) : (
              <Button 
                onClick={() => handleConnect('google')}
                disabled={isConnecting === 'google'}
              >
                {isConnecting === 'google' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    Connect
                  </>
                )}
              </Button>
            )}
          </div>
          
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23 4.5C23 6.43 21.43 8 19.5 8S16 6.43 16 4.5 17.57 1 19.5 1 23 2.57 23 4.5zm-1.02 4.04c-.79.6-1.77.96-2.83.96-1.12 0-2.14-.4-2.95-1.07C8.24 12.12 5.67 18.14 2 18.5v2c1.48 0 2.9-.21 4.23-.6 1.5-.43 2.9-1.12 4.14-2.07 2.45-1.87 4.35-4.63 5.36-7.79.8.42 1.7.66 2.65.66 1.76 0 3.34-.79 4.42-2.04v19.8h2V.01c-.11.01-.21.04-.32.04-1.31 0-2.48-.62-3.27-1.57L19 0l-2.13 1.55c-.23.27-.45.52-.7.76.33.55.52 1.18.52 1.85 0 1.86-1.46 3.39-3.3 3.54 1.09.52 2.05 1.29 2.78 2.26.6-.32 1.26-.52 1.96-.52 1.11 0 2.13.42 2.85 1.1z"/>
                </svg>
              </div>
              <div>
                <h4 className="font-medium">Outlook Calendar</h4>
                <p className="text-sm text-muted-foreground">
                  {isConnected('outlook') ? 'Connected' : 'Not connected'}
                </p>
              </div>
            </div>
            {isConnected('outlook') ? (
              <Button 
                variant="outline" 
                onClick={() => handleDisconnect(getConnectedId('outlook') as string, 'outlook')}
              >
                Disconnect
              </Button>
            ) : (
              <Button 
                onClick={() => handleConnect('outlook')}
                disabled={isConnecting === 'outlook'}
              >
                {isConnecting === 'outlook' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    Connect
                  </>
                )}
              </Button>
            )}
          </div>
          
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
              </div>
              <div>
                <h4 className="font-medium">Apple Calendar</h4>
                <p className="text-sm text-muted-foreground">
                  {isConnected('apple') ? 'Connected' : 'Not connected'}
                </p>
              </div>
            </div>
            {isConnected('apple') ? (
              <Button 
                variant="outline" 
                onClick={() => handleDisconnect(getConnectedId('apple') as string, 'apple')}
              >
                Disconnect
              </Button>
            ) : (
              <Button 
                onClick={() => handleConnect('apple')}
                disabled={isConnecting === 'apple'}
              >
                {isConnecting === 'apple' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    Connect
                  </>
                )}
              </Button>
            )}
          </div>
          
          <p className="text-sm text-muted-foreground mt-2">
            <Check className="inline-block h-4 w-4 mr-1 text-green-500" />
            Your appointments will be synced with connected calendars automatically.
          </p>
        </div>
      )}
    </div>
  );
};

export default CalendarSync;
