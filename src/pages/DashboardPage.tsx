
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Users, Building, DollarSign, Activity, Bell, FileText } from "lucide-react";
import NotificationsOverview from "@/components/NotificationsOverview";

const summaryStats = [
  {
    label: "Total Clients",
    value: 28,
    icon: Users,
    badge: "Active",
    badgeColor: "bg-green-100 text-green-700"
  },
  {
    label: "Partner Facilities",
    value: 120,
    icon: Building,
    badge: "Pro",
    badgeColor: "bg-purple-100 text-purple-700"
  },
  {
    label: "Revenue YTD",
    value: "$112K",
    icon: DollarSign,
    badge: "Growth",
    badgeColor: "bg-amber-100 text-amber-700"
  },
];

const activityFeed = [
  {
    id: 1,
    title: "Mary Johnson placed at Desert Bloom",
    date: "Today, 2:30 PM",
    type: "placement",
    icon: Building,
  },
  {
    id: 2,
    title: "Robert Smith scheduled for tour",
    date: "Tomorrow, 11:00 AM",
    type: "appointment",
    icon: Calendar,
  },
  {
    id: 3,
    title: "Payment received from Mesa Gardens",
    date: "Yesterday",
    type: "payment",
    icon: DollarSign,
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
];

export default function DashboardPage() {
  const { user } = useAuth();
  const initials = user?.name?.split(" ").map((n:string) => n[0]).join("") || "U";
  
  console.log("Rendering DashboardPage with user:", user);

  return (
    <div className="py-8 px-4 max-w-5xl mx-auto">
      {/* HEADER - avatar, summary, info */}
      <Card className="mb-8">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-healthcare-200">
                <AvatarImage src={`https://avatar.vercel.sh/${user?.email || "unknown"}`} />
                <AvatarFallback className="text-xl">{initials}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{user?.name || "User Dashboard"}</CardTitle>
                <CardDescription>
                  Welcome back {user?.name ? user.name.split(" ")[0] : ""}! Here is your placement activity and progress overview.
                </CardDescription>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline" className="bg-healthcare-50">
                    {user?.subscription ? user.subscription.toUpperCase() : "BASIC"} Plan
                  </Badge>
                  <Badge variant="outline" className="bg-healthcare-50">
                    Role: {user?.role || "Consultant"}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
              <Button>New Placement</Button>
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 py-3">
            {summaryStats.map(stat => (
              <div key={stat.label} className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${stat.badgeColor}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-lg font-bold">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                  <Badge variant="outline" className={`mt-1 ${stat.badgeColor}`}>{stat.badge}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* BODY - Tabs style */}
      <Card>
        <CardContent>
          <Tabs defaultValue="activity" className="py-8">
            <TabsList className="gap-4 mb-6">
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="clients">Clients</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>
            
            {/* ACTIVITY TAB */}
            <TabsContent value="activity" className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Recent Activity</h3>
                <div className="space-y-3">
                  {activityFeed.map((activity) => (
                    <div key={activity.id} className="p-3 border rounded-lg flex items-center gap-3">
                      <activity.icon className="h-5 w-5 text-healthcare-600" />
                      <div className="flex-1">
                        <span className="font-medium">{activity.title}</span>
                        <div className="text-xs text-muted-foreground">{activity.date}</div>
                      </div>
                      <Badge variant="outline" className="bg-healthcare-50 capitalize">{activity.type}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            {/* CLIENTS TAB */}
            <TabsContent value="clients" className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Your Clients</h3>
                <div className="text-muted-foreground">Client details coming soon...</div>
              </div>
            </TabsContent>
            
            {/* NOTIFICATIONS TAB */}
            <TabsContent value="notifications" className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Recent Notifications</h3>
                <div className="space-y-3">
                  {notifications.map(notification => (
                    <div key={notification.id} className="flex items-start gap-3 border p-3 rounded-lg">
                      <Bell className="h-4 w-4 mt-1 text-healthcare-600" />
                      <div>
                        <div className="font-medium">{notification.title}</div>
                        <div className="text-xs text-muted-foreground">{notification.message}</div>
                        <div className="text-xs text-muted-foreground">{notification.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
