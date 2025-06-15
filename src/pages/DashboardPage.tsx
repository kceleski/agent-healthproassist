import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Users, Building, DollarSign, Activity, Bell, FileText, Search, Map } from "lucide-react";
import NotificationsOverview from "@/components/NotificationsOverview";
import { useState } from "react";
import { Link } from "react-router-dom";

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

const quickLinks = [
  { title: "Search", icon: Search, path: "/search", color: "bg-healthcare-100 text-healthcare-600" },
  { title: "Map", icon: Map, path: "/map", color: "bg-green-100 text-green-600" },
  { title: "Calendar", icon: Calendar, path: "/calendar", color: "bg-purple-100 text-purple-600" },
  { title: "Clients", icon: Users, path: "/contacts", color: "bg-amber-100 text-amber-600" },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const initials = user?.name?.split(" ").map((n:string) => n[0]).join("") || "U";
  
  return (
    <div className="px-4 py-6 max-w-5xl mx-auto border-4 border-red-500 min-h-[200px]">
      {/* DEBUG: If you see this, the DashboardPage root is rendering */}
      <div className="text-lg font-bold text-red-700 mb-2">[DEBUG] DashboardPage Container is rendering!</div>

      {/* Mobile-friendly welcome header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Avatar className="h-10 w-10 md:h-12 md:w-12 border-2 border-healthcare-200">
            <AvatarImage src={`https://avatar.vercel.sh/${user?.email || "unknown"}`} />
            <AvatarFallback className="text-lg">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl md:text-2xl font-bold">Welcome, {user?.name ? user.name.split(" ")[0] : "User"}!</h2>
            <p className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge variant="outline" className="bg-healthcare-50">
            {user?.subscription ? user.subscription.toUpperCase() : "BASIC"} Plan
          </Badge>
          <Badge variant="outline" className="bg-healthcare-50">
            Role: {user?.role || "Consultant"}
          </Badge>
        </div>
      </div>
      
      {/* Quick Actions for Mobile */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Quick Actions</h3>
        <div className="grid grid-cols-4 gap-2">
          {quickLinks.map((link) => (
            <Link key={link.title} to={link.path} className="flex flex-col items-center">
              <div className={`p-3 rounded-full ${link.color} mb-1`}>
                <link.icon className="h-5 w-5" />
              </div>
              <span className="text-xs">{link.title}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* SUMMARY STATS - more mobile friendly */}
      <div className="container-soft-blue mb-6 p-4">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Overview</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {summaryStats.map(stat => (
            <div key={stat.label} className="bg-white p-3 rounded-lg flex items-center gap-3 shadow-sm">
              <div className={`p-2 rounded-full ${stat.badgeColor}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-lg font-bold">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* BODY - Tabs style - mobile friendly */}
      <Card className="container-soft-blue">
        <CardContent className="p-0">
          <Tabs defaultValue="activity" className="w-full">
            <TabsList className="w-full grid grid-cols-3 h-12">
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="clients">Clients</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>
            
            {/* ACTIVITY TAB */}
            <TabsContent value="activity" className="p-4 space-y-4">
              <div>
                <h3 className="text-base font-semibold mb-3">Recent Activity</h3>
                <div className="space-y-3">
                  {activityFeed.map((activity) => (
                    <div key={activity.id} className="p-3 border rounded-lg flex items-center gap-3 bg-white">
                      <activity.icon className="h-5 w-5 text-healthcare-600 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{activity.title}</div>
                        <div className="text-xs text-muted-foreground">{activity.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            {/* CLIENTS TAB */}
            <TabsContent value="clients" className="p-4 space-y-4">
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto text-healthcare-300 mb-2" />
                <h3 className="text-base font-semibold">No Recent Clients</h3>
                <p className="text-sm text-muted-foreground mt-1">Add your first client to see them here</p>
                <Button className="mt-4" asChild>
                  <Link to="/contacts">View Clients</Link>
                </Button>
              </div>
            </TabsContent>
            
            {/* NOTIFICATIONS TAB */}
            <TabsContent value="notifications" className="p-4 space-y-4">
              <div>
                <h3 className="text-base font-semibold mb-3">Recent Notifications</h3>
                <div className="space-y-3">
                  {notifications.map(notification => (
                    <div key={notification.id} className="flex items-start gap-3 border p-3 rounded-lg bg-white">
                      <Bell className="h-4 w-4 mt-1 text-healthcare-600 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{notification.title}</div>
                        <div className="text-xs text-muted-foreground">{notification.message}</div>
                        <div className="text-xs text-muted-foreground mt-1">{notification.time}</div>
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
