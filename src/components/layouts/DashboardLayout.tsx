
import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { getUserTier } from '@/utils/subscription';
import { 
  Building, 
  Home, 
  Contact, 
  DollarSign,
  UserCog,
  LogOut,
  Map,
  Calendar,
  Search,
  Heart,
  Bookmark,
  FileText,
  Menu,
  X
} from 'lucide-react';

import { 
  Sidebar, 
  SidebarContent, 
  SidebarTrigger,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { SubscriptionToggle } from '@/components/ui/subscription-toggle';
import { NotificationsInbox } from '@/components/notifications/NotificationsInbox';
import { useIsMobile } from '@/hooks/use-mobile';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Get user tier synchronously from the user object for demo users, or default to 'basic'
  const initialTier = user?.isDemo ? user.subscription || 'basic' : 'basic';
  const [userTier, setUserTier] = useState(initialTier);
  
  // Update userTier when needed for non-demo users
  useEffect(() => {
    const updateTier = async () => {
      if (!user?.isDemo) {
        const tier = await getUserTier(user);
        setUserTier(tier);
      }
    };
    
    updateTier();
  }, [user]);
  
  const isPro = userTier === 'premium';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const basicMenuItems = [
    { title: 'Dashboard', path: '/dashboard', icon: Home },
    { title: 'Search Facilities', path: '/search', icon: Search },
    { title: 'Map View', path: '/map', icon: Map },
    { title: 'Saved Facilities', path: '/favorites', icon: Heart },
    { title: 'Saved Searches', path: '/saved-searches', icon: Bookmark },
    { title: 'Clients', path: '/contacts', icon: Contact },
    { title: 'Medical Records', path: '/medical-records', icon: FileText },
    { title: 'Calendar', path: '/calendar', icon: Calendar },
    { title: 'Profile', path: '/profile', icon: UserCog },
  ];

  const proMenuItems = [
    { title: 'Dashboard', path: '/dashboard', icon: Home },
    { title: 'Search Facilities', path: '/search', icon: Search },
    { title: 'Map View', path: '/map', icon: Map },
    { title: 'Saved Facilities', path: '/favorites', icon: Heart },
    { title: 'Medical Records', path: '/medical-records', icon: FileText },
    { title: 'Contacts', path: '/contacts', icon: Contact },
    { title: 'Payments', path: '/payments', icon: DollarSign },
    { title: 'Profile', path: '/profile', icon: UserCog },
  ];

  const menuItems = isPro ? proMenuItems : basicMenuItems;

  const SidebarContents = () => (
    <>
      <SidebarHeader className="p-4">
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/707d0553-01f0-4e69-9d13-66a5665635f9.png" 
            alt="HealthProAssist Logo" 
            className="h-8" 
          />
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    onClick={() => isMobile && setIsSidebarOpen(false)}
                  >
                    <NavLink 
                      to={item.path}
                      className={({ isActive }) => 
                        isActive ? "text-healthcare-600 font-medium" : "text-muted-foreground hover:text-foreground"
                      }
                    >
                      <item.icon size={18} />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4 border-t">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={`https://avatar.vercel.sh/${user?.email}`} />
              <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="w-full justify-start gap-2" 
            onClick={handleLogout}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </Button>
        </div>
      </SidebarFooter>
    </>
  );

  return (
    <div className="h-screen flex w-full overflow-hidden">
      {isMobile ? (
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetContent side="left" className="w-[80%] p-0 bg-white">
            <SidebarContents />
          </SheetContent>
        </Sheet>
      ) : (
        <SidebarProvider defaultOpen={!isMobile}>
          <Sidebar className="h-screen flex-shrink-0">
            <SidebarContents />
          </Sidebar>
        </SidebarProvider>
      )}
      
      <div className="flex-1 flex flex-col overflow-hidden h-screen bg-white">
        <header className="flex-shrink-0 sticky top-0 z-30 border-b bg-white shadow-sm">
          <div className="flex h-14 items-center px-4">
            {isMobile && (
              <Button 
                variant="ghost" 
                size="icon"
                className="mr-2 text-healthcare-600"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}
            {!isMobile && <SidebarTrigger />}
            <div className="flex-1 flex items-center justify-between">
              <h1 className="text-lg font-medium text-healthcare-600">
                {location.pathname === '/dashboard' ? 'Dashboard' : 
                 location.pathname === '/search' ? 'Search' :
                 location.pathname === '/contacts' ? 'Contacts' :
                 location.pathname === '/map' ? 'Map View' : 'HealthProAssist'}
              </h1>
              <div className="flex items-center space-x-2">
                <NotificationsInbox />
                <SubscriptionToggle />
                <div className="hidden md:block">
                  <Badge variant="outline" className={`bg-healthcare-100 text-healthcare-700 px-2 py-0.5`}>
                    {isPro ? 'Pro' : 'Basic'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-auto pb-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
