
import { Outlet } from 'react-router-dom';
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
} from '@/components/ui/sidebar';
import { useAuth } from '@/context/AuthContext';
import { 
  Building, 
  Home, 
  Contact, 
  DollarSign,
  UserCog,
  LogOut,
  Map
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { title: 'Dashboard', path: '/dashboard', icon: Home },
    { title: 'Facilities', path: '/facilities', icon: Building },
    { title: 'Facility Map', path: '/map', icon: Map },
    { title: 'Contacts', path: '/contacts', icon: Contact },
    { title: 'Payments', path: '/payments', icon: DollarSign },
    { title: 'Profile', path: '/profile', icon: UserCog },
  ];

  return (
    <div className="min-h-screen flex w-full">
      <Sidebar>
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-healthcare-600 flex items-center justify-center">
              <span className="text-white font-semibold text-sm">HP</span>
            </div>
            <div className="font-semibold text-xl">HealthProAssist</div>
          </div>
        </SidebarHeader>
        
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
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
                <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
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
      </Sidebar>
      
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <SidebarTrigger />
          <div className="text-sm font-medium">
            Subscription: <span className="bg-healthcare-100 text-healthcare-700 px-2 py-0.5 rounded-full">{user?.subscription || 'None'}</span>
          </div>
        </div>
        
        <main className="flex-1 p-6 overflow-auto animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
