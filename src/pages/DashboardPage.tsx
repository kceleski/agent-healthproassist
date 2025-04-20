
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, DollarSign, User, ArrowUpRight, Calendar, Globe, Users, Bell, FileText } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import AddToTaskButton from "@/components/todos/AddToTaskButton";
import SetupGuideButton from "@/components/dashboard/SetupGuideButton";

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

  const renderCalendarCard = () => (
    <Card className="glass-card animate-zoom-in h-full" style={{ animationDelay: '500ms' }}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base sm:text-lg">Upcoming Appointments</CardTitle>
            <CardDescription>Your scheduled meetings</CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link to="/calendar">
              <Calendar className="h-3.5 w-3.5 mr-1" />
              <span>Add</span>
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {upcomingAppointments.map((appointment) => (
            <div key={appointment.id} className="flex items-start gap-3 p-2 sm:p-3 rounded-lg border">
              <div className="bg-healthcare-100 text-healthcare-700 h-8 w-8 sm:h-10 sm:w-10 rounded-full flex items-center justify-center shrink-0">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-xs sm:text-sm truncate">{appointment.title}</h4>
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
  );

  const renderNotificationsCard = () => (
    <Card className="glass-card animate-zoom-in h-full" style={{ animationDelay: '400ms' }}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base sm:text-lg">Notifications</CardTitle>
            <CardDescription>Recent updates and alerts</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <Bell className="h-3.5 w-3.5 mr-1" />
            <span className="hidden sm:inline">Mark all read</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div key={notification.id} className="flex items-start gap-3 p-2 sm:p-3 rounded-lg border">
              <div className={`h-8 w-8 sm:h-10 sm:w-10 rounded-full flex items-center justify-center shrink-0 
                ${notification.type === 'info' ? 'bg-blue-100 text-blue-700' : 
                  notification.type === 'reminder' ? 'bg-amber-100 text-amber-700' : 
                  notification.type === 'warning' ? 'bg-orange-100 text-orange-700' : 
                  'bg-green-100 text-green-700'}`}>
                <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-xs sm:text-sm truncate">{notification.title}</h4>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">{notification.message}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{notification.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderReferralsCard = () => (
    <Card className="glass-card animate-zoom-in col-span-full" style={{ animationDelay: '600ms' }}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base sm:text-lg">Recent Referrals</CardTitle>
            <CardDescription>New client referrals requiring your attention</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleViewAllReferrals}>
            <FileText className="h-3.5 w-3.5 mr-1" />
            <span className="hidden sm:inline">View All</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0 sm:p-6">
        <div className="rounded-lg border overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-xs font-medium text-muted-foreground text-left p-2 sm:p-3">Client Name</th>
                <th className="text-xs font-medium text-muted-foreground text-left p-2 sm:p-3">Age</th>
                <th className="text-xs font-medium text-muted-foreground text-left p-2 sm:p-3">Needs</th>
                <th className="text-xs font-medium text-muted-foreground text-left p-2 sm:p-3 hidden md:table-cell">Referred By</th>
                <th className="text-xs font-medium text-muted-foreground text-left p-2 sm:p-3 hidden sm:table-cell">Date</th>
                <th className="text-xs font-medium text-muted-foreground text-left p-2 sm:p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {recentReferrals.map((referral) => (
                <tr key={referral.id} className="border-t hover:bg-muted/30 transition-colors">
                  <td className="p-2 sm:p-3 text-xs sm:text-sm font-medium truncate max-w-[100px] sm:max-w-none">{referral.name}</td>
                  <td className="p-2 sm:p-3 text-xs sm:text-sm">{referral.age}</td>
                  <td className="p-2 sm:p-3">
                    <Badge variant="outline" className="bg-healthcare-50 text-xs">
                      {referral.needsType}
                    </Badge>
                  </td>
                  <td className="p-2 sm:p-3 hidden md:table-cell text-xs sm:text-sm text-muted-foreground">{referral.referredBy}</td>
                  <td className="p-2 sm:p-3 hidden sm:table-cell text-xs sm:text-sm text-muted-foreground">{referral.date}</td>
                  <td className="p-2 sm:p-3">
                    <Button size="sm" variant="outline" className="text-xs h-7 px-2" onClick={() => handleProcessReferral(referral.id, referral.name)}>Process</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="flex flex-col w-full min-h-screen p-4 space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
        <SetupGuideButton />
      </div>
      
      {/* Stats Grid - Responsive grid that becomes single column on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card 
            key={i} 
            className="glass-card animate-zoom-in transition-all duration-300 hover:shadow-lg"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <CardHeader className="flex flex-row items-center justify-between p-4">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
              <Link 
                to={stat.link} 
                className="text-healthcare-600 text-sm font-medium inline-flex items-center mt-2 hover:underline"
              >
                View details
                <ArrowUpRight className="ml-1 h-3 w-3" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Area - Flexible layout that adapts to screen size */}
      <div className="flex flex-col lg:flex-row gap-6">
        {isPro ? (
          <>
            {/* Facilities Section - Takes 2/3 of the space on large screens */}
            <div className="flex-grow lg:w-2/3">
              <Card className="h-full glass-card animate-zoom-in">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Recent Facilities</CardTitle>
                      <CardDescription>Facilities you've recently interacted with</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/facilities">
                        <span>View all</span>
                        <ArrowUpRight className="h-3 w-3 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="text-xs font-medium text-left p-3">Facility</th>
                          <th className="text-xs font-medium text-left p-3">Type</th>
                          <th className="text-xs font-medium text-left p-3 hidden md:table-cell">Location</th>
                          <th className="text-xs font-medium text-left p-3 hidden lg:table-cell">Last Contact</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentFacilities.map((facility) => (
                          <tr key={facility.id} className="border-t hover:bg-muted/30 transition-colors">
                            <td className="p-3">
                              <Link to={`/facilities/${facility.id}`} className="font-medium text-sm text-healthcare-700 hover:underline">
                                {facility.name}
                              </Link>
                            </td>
                            <td className="p-3 text-sm">{facility.type}</td>
                            <td className="p-3 hidden md:table-cell">
                              <div className="flex items-center text-sm">
                                <Globe className="h-3 w-3 mr-1 text-muted-foreground" />
                                {facility.location}
                              </div>
                            </td>
                            <td className="p-3 text-sm text-muted-foreground hidden lg:table-cell">{facility.lastContacted}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Calendar Section - Takes 1/3 of the space on large screens */}
            <div className="lg:w-1/3">
              {renderCalendarCard()}
            </div>
          </>
        ) : (
          <>
            {/* Basic tier layout - Equal columns on large screens */}
            <div className="lg:w-1/2">
              {renderNotificationsCard()}
            </div>
            <div className="lg:w-1/2">
              {renderCalendarCard()}
            </div>
          </>
        )}
      </div>

      {/* Referrals Section - Full width */}
      <div className="w-full">
        {renderReferralsCard()}
      </div>
    </div>
  );
};

export default DashboardPage;
