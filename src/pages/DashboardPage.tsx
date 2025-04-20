
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, DollarSign, User, ArrowUpRight, Calendar, Globe, Users, Bell, FileText } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import AddToTaskButton from "@/components/todos/AddToTaskButton";
import SetupGuideButton from "@/components/dashboard/SetupGuideButton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const demoTier = user?.demoTier || user?.subscription || 'basic';
  const isPro = demoTier === 'premium';

  const stats = isPro ? [
    {
      title: "Facilities",
      value: "248",
      change: "+12% from last month",
      icon: <Building className="h-5 w-5 text-healthcare-600" />,
      link: "/facilities",
    },
    {
      title: "Active Seniors",
      value: "14",
      change: "+3 this week",
      icon: <Users className="h-5 w-5 text-healthcare-600" />,
      link: "/contacts",
    },
    {
      title: "Placements",
      value: "8",
      change: "This month",
      icon: <User className="h-5 w-5 text-healthcare-600" />,
      link: "/contacts",
    },
    {
      title: "Revenue",
      value: "$24,500",
      change: "Year to date",
      icon: <DollarSign className="h-5 w-5 text-healthcare-600" />,
      link: "/payments",
    },
  ] : [
    {
      title: "Clients",
      value: "14",
      change: "+3 this week",
      icon: <Users className="h-5 w-5 text-healthcare-600" />,
      link: "/contacts",
    },
    {
      title: "Facilities Viewed",
      value: "24",
      change: "This month",
      icon: <Building className="h-5 w-5 text-healthcare-600" />,
      link: "/facilities",
    },
  ];

  const recentFacilities = [
    {
      id: "1",
      name: "Sunset Senior Living",
      type: "Assisted Living",
      location: "San Francisco, CA",
      lastContacted: "2 days ago",
    },
    {
      id: "2",
      name: "Golden Years Home",
      type: "Memory Care",
      location: "Oakland, CA",
      lastContacted: "5 days ago",
    },
    {
      id: "3",
      name: "Serenity Care Center",
      type: "Skilled Nursing",
      location: "San Jose, CA",
      lastContacted: "1 week ago",
    },
    {
      id: "4",
      name: "Riverside Retirement",
      type: "Independent Living",
      location: "Palo Alto, CA",
      lastContacted: "2 weeks ago",
    },
  ];

  const upcomingAppointments = [
    {
      id: "1",
      title: "Facility Tour - Sunset Senior Living",
      date: "Tomorrow, 10:00 AM",
      client: "Robert Johnson",
    },
    {
      id: "2",
      title: "Family Meeting - Golden Years Home",
      date: "Thursday, 2:30 PM",
      client: "Maria Garcia",
    },
    {
      id: "3",
      title: "Assessment - Serenity Care Center",
      date: "Friday, 11:00 AM",
      client: "James Williams",
    },
  ];

  const recentReferrals = [
    {
      id: "1",
      name: "Thomas Anderson",
      age: 78,
      needsType: "Memory Care",
      referredBy: "St. Mary's Hospital",
      date: "Today, 9:15 AM",
    },
    {
      id: "2",
      name: "Eleanor Smith",
      age: 82,
      needsType: "Assisted Living",
      referredBy: "Dr. Patel",
      date: "Yesterday, 3:40 PM",
    },
    {
      id: "3",
      name: "Richard Wong",
      age: 75,
      needsType: "Independent Living",
      referredBy: "Family Member",
      date: "2 days ago",
    },
  ];

  const notifications = [
    {
      id: "1",
      title: "New referral received",
      message: "You have a new client referral from St. Mary's Hospital",
      time: "15 minutes ago",
      type: "info",
    },
    {
      id: "2",
      title: "Appointment reminder",
      message: "Facility tour with Robert Johnson tomorrow at 10:00 AM",
      time: "1 hour ago",
      type: "reminder",
    },
    {
      id: "3",
      title: "Document needed",
      message: "Please upload medical records for Maria Garcia",
      time: "3 hours ago",
      type: "warning",
    },
    {
      id: "4",
      title: "Client placement confirmed",
      message: "James Williams has been placed at Serenity Care Center",
      time: "Yesterday",
      type: "success",
    },
  ];

  const handleProcessReferral = (referralId: string, clientName: string) => {
    toast.success(`Processing referral for ${clientName}`);
    navigate(`/contacts?referral=${referralId}`);
  };

  const handleViewAllReferrals = () => {
    navigate('/contacts?tab=referrals');
  };

  return (
    <div className="h-[calc(100vh-56px)] flex flex-col">
      {/* Header Section - Taking minimal space */}
      <div className="flex items-center justify-between py-2 px-1">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Dashboard</h1>
        <SetupGuideButton />
      </div>
      
      {/* Main Content - Fills available space with ScrollArea */}
      <ScrollArea className="flex-1 -mx-4 px-4">
        <div className="flex flex-col gap-4 pb-4">
          {/* Stats Cards - Auto-adjusting grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 auto-rows-fr">
            {stats.map((stat, i) => (
              <Card 
                key={i} 
                className="glass-card animate-zoom-in transition-all duration-300 hover:shadow-lg h-full"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <CardHeader className="flex flex-row items-center justify-between p-3">
                  <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  {stat.icon}
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <div className="text-lg font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.change}</p>
                  <Link 
                    to={stat.link} 
                    className="text-healthcare-600 text-xs font-medium inline-flex items-center mt-1 hover:underline"
                  >
                    View details
                    <ArrowUpRight className="ml-1 h-3 w-3" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Dynamic Layout Based on User Tier */}
          {isPro ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Facilities Table */}
              <Card className="glass-card lg:col-span-2 h-full">
                <CardHeader className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">Recent Facilities</CardTitle>
                      <CardDescription>Facilities you've recently interacted with</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/facilities">
                        <span className="text-xs">View all</span>
                        <ArrowUpRight className="h-3 w-3 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs font-medium w-[40%]">Facility</TableHead>
                        <TableHead className="text-xs font-medium w-[20%]">Type</TableHead>
                        <TableHead className="text-xs font-medium hidden md:table-cell w-[25%]">Location</TableHead>
                        <TableHead className="text-xs font-medium hidden lg:table-cell w-[15%]">Last Contact</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentFacilities.map((facility) => (
                        <TableRow key={facility.id}>
                          <TableCell className="font-medium text-xs p-2">
                            <Link to={`/facilities/${facility.id}`} className="text-healthcare-700 hover:underline">
                              {facility.name}
                            </Link>
                          </TableCell>
                          <TableCell className="text-xs p-2">{facility.type}</TableCell>
                          <TableCell className="hidden md:table-cell text-xs p-2">
                            <div className="flex items-center">
                              <Globe className="h-3 w-3 mr-1 text-muted-foreground" />
                              {facility.location}
                            </div>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell text-xs text-muted-foreground p-2">{facility.lastContacted}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              
              {/* Calendar Card */}
              <Card className="glass-card h-full">
                <CardHeader className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">Upcoming Appointments</CardTitle>
                      <CardDescription className="text-xs">Your scheduled meetings</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/calendar" className="text-xs flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span className="hidden sm:inline">Add</span>
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <div className="space-y-2">
                    {upcomingAppointments.map((appointment) => (
                      <div key={appointment.id} className="flex items-start gap-3 p-2 rounded-lg border">
                        <div className="bg-healthcare-100 text-healthcare-700 h-8 w-8 rounded-full flex items-center justify-center shrink-0">
                          <Calendar className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-xs truncate">{appointment.title}</h4>
                          <p className="text-xs text-muted-foreground mt-0.5">{appointment.date}</p>
                          <p className="text-xs mt-0.5 truncate">Client: {appointment.client}</p>
                        </div>
                        <AddToTaskButton
                          actionText={`Prepare for ${appointment.title}`}
                          size="sm"
                          variant="outline"
                          className="hidden sm:flex"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Notifications Card for Basic Tier */}
              <Card className="glass-card h-full">
                <CardHeader className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">Notifications</CardTitle>
                      <CardDescription className="text-xs">Recent updates and alerts</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="text-xs">
                      <Bell className="h-3 w-3 mr-1" />
                      <span className="hidden sm:inline">Mark all read</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <div className="space-y-2">
                    {notifications.map((notification) => (
                      <div key={notification.id} className="flex items-start gap-3 p-2 rounded-lg border">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 
                          ${notification.type === 'info' ? 'bg-blue-100 text-blue-700' : 
                            notification.type === 'reminder' ? 'bg-amber-100 text-amber-700' : 
                            notification.type === 'warning' ? 'bg-orange-100 text-orange-700' : 
                            'bg-green-100 text-green-700'}`}>
                          <Bell className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-xs truncate">{notification.title}</h4>
                          <p className="text-xs text-muted-foreground mt-0.5 truncate">{notification.message}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{notification.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Calendar Card for Basic Tier */}
              <Card className="glass-card h-full">
                <CardHeader className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">Upcoming Appointments</CardTitle>
                      <CardDescription className="text-xs">Your scheduled meetings</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/calendar" className="text-xs flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span className="hidden sm:inline">Add</span>
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <div className="space-y-2">
                    {upcomingAppointments.map((appointment) => (
                      <div key={appointment.id} className="flex items-start gap-3 p-2 rounded-lg border">
                        <div className="bg-healthcare-100 text-healthcare-700 h-8 w-8 rounded-full flex items-center justify-center shrink-0">
                          <Calendar className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-xs truncate">{appointment.title}</h4>
                          <p className="text-xs text-muted-foreground mt-0.5">{appointment.date}</p>
                          <p className="text-xs mt-0.5 truncate">Client: {appointment.client}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Referrals Table - Full Width with optimized display */}
          <Card className="glass-card">
            <CardHeader className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Recent Referrals</CardTitle>
                  <CardDescription className="text-xs">New client referrals requiring your attention</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={handleViewAllReferrals} className="text-xs">
                  <FileText className="h-3 w-3 mr-1" />
                  <span className="hidden sm:inline">View All</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-hidden">
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs font-medium p-2 w-[30%]">Client Name</TableHead>
                      <TableHead className="text-xs font-medium p-2 w-[10%]">Age</TableHead>
                      <TableHead className="text-xs font-medium p-2 w-[20%]">Needs</TableHead>
                      <TableHead className="text-xs font-medium p-2 hidden md:table-cell w-[20%]">Referred By</TableHead>
                      <TableHead className="text-xs font-medium p-2 hidden sm:table-cell w-[10%]">Date</TableHead>
                      <TableHead className="text-xs font-medium p-2 w-[10%]">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentReferrals.map((referral) => (
                      <TableRow key={referral.id}>
                        <TableCell className="p-2 text-xs font-medium">{referral.name}</TableCell>
                        <TableCell className="p-2 text-xs">{referral.age}</TableCell>
                        <TableCell className="p-2">
                          <Badge variant="outline" className="bg-healthcare-50 text-xs">
                            {referral.needsType}
                          </Badge>
                        </TableCell>
                        <TableCell className="p-2 hidden md:table-cell text-xs text-muted-foreground">{referral.referredBy}</TableCell>
                        <TableCell className="p-2 hidden sm:table-cell text-xs text-muted-foreground">{referral.date}</TableCell>
                        <TableCell className="p-2">
                          <Button size="sm" variant="outline" className="text-xs h-7 px-2" onClick={() => handleProcessReferral(referral.id, referral.name)}>Process</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
};

export default DashboardPage;
