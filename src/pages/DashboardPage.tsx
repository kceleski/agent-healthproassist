
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Users, Building, DollarSign, Activity, Bell, FileText, Search, Map, RefreshCw } from "lucide-react";
import NotificationsOverview from "@/components/NotificationsOverview";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useDashboardData } from "@/hooks/useDashboardData";

const quickLinks = [
  { title: "Search", icon: Search, path: "/search", color: "bg-healthcare-100 text-healthcare-600" },
  { title: "Map", icon: Map, path: "/map", color: "bg-green-100 text-green-600" },
  { title: "Calendar", icon: Calendar, path: "/calendar", color: "bg-purple-100 text-purple-600" },
  { title: "Clients", icon: Users, path: "/contacts", color: "bg-amber-100 text-amber-600" },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const { stats, activity, notifications, loading, error, refresh } = useDashboardData();
  const initials = user?.name?.split(" ").map((n:string) => n[0]).join("") || "U";

  // Create summary stats array from live data
  const summaryStats = stats ? [
    {
      label: "Total Clients",
      value: stats.totalClients,
      icon: Users,
      badge: "Active",
      badgeColor: "bg-green-100 text-green-700"
    },
    {
      label: "Partner Facilities",
      value: stats.partnerFacilities,
      icon: Building,
      badge: "Pro",
      badgeColor: "bg-purple-100 text-purple-700"
    },
    {
      label: "Revenue YTD",
      value: stats.revenueYTD,
      icon: DollarSign,
      badge: "Growth",
      badgeColor: "bg-amber-100 text-amber-700"
    },
  ] : [];

  if (error) {
    return (
      <div className="px-4 py-6 max-w-5xl mx-auto">
        <div className="text-center py-8">
          <div className="text-red-600 mb-4">Error loading dashboard data</div>
          <Button onClick={refresh} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="px-4 py-6 max-w-5xl mx-auto border-8 border-blue-500 min-h-[400px] relative bg-yellow-100 z-50">
      {/* EXTRA DEBUG */}
      <div style={{
        background: "#f00",
        color: "#fff",
        fontWeight: "bold",
        fontSize: 24,
        padding: "12px 0",
        textAlign: "center",
        border: "6px dashed #000",
        zIndex: 10001,
        position: "relative"
      }}>
        [DEBUG] DashboardPage is rendering (DESKTOP + MOBILE) - LIVE DATA: {loading ? 'LOADING' : 'LOADED'}
      </div>
      
      {/* Mobile-friendly welcome header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Avatar className="h-10 w-10 md:h-12 md:w-12 border-2 border-healthcare-200">
            <AvatarImage src={`https://avatar.vercel.sh/${user?.email || "unknown"}`} />
            <AvatarFallback className="text-lg">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-xl md:text-2xl font-bold">Welcome, {user?.name ? user.name.split(" ")[0] : "User"}!</h2>
            <p className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={refresh} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge variant="outline" className="bg-healthcare-50">
            {user?.subscription ? user.subscription.toUpperCase() : "BASIC"} Plan
          </Badge>
          <Badge variant="outline" className="bg-healthcare-50">
            Role: {user?.role || "Consultant"}
          </Badge>
          {loading && (
            <Badge variant="outline" className="bg-blue-50">
              Loading Data...
            </Badge>
          )}
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

      {/* SUMMARY STATS - now using live data */}
      <div className="container-soft-blue mb-6 p-4">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Overview</h3>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white p-3 rounded-lg flex items-center gap-3 shadow-sm animate-pulse">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-6 bg-gray-200 rounded mb-1"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
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
        )}
      </div>
      
      {/* BODY - Tabs style - mobile friendly with live data */}
      <Card className="container-soft-blue">
        <CardContent className="p-0">
          <Tabs defaultValue="activity" className="w-full">
            <TabsList className="w-full grid grid-cols-3 h-12">
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="clients">Clients</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>
            
            {/* ACTIVITY TAB - now using live data */}
            <TabsContent value="activity" className="p-4 space-y-4">
              <div>
                <h3 className="text-base font-semibold mb-3">Recent Activity</h3>
                {loading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="p-3 border rounded-lg flex items-center gap-3 bg-white animate-pulse">
                        <div className="w-5 h-5 bg-gray-200 rounded"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded mb-1"></div>
                          <div className="h-3 bg-gray-200 rounded w-24"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : activity.length > 0 ? (
                  <div className="space-y-3">
                    {activity.map((activityItem) => (
                      <div key={activityItem.id} className="p-3 border rounded-lg flex items-center gap-3 bg-white">
                        <Activity className="h-5 w-5 text-healthcare-600 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">{activityItem.title}</div>
                          <div className="text-xs text-muted-foreground">{activityItem.date}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Activity className="h-12 w-12 mx-auto text-healthcare-300 mb-2" />
                    <h3 className="text-base font-semibold">No Recent Activity</h3>
                    <p className="text-sm text-muted-foreground mt-1">Your activity will appear here</p>
                  </div>
                )}
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
            
            {/* NOTIFICATIONS TAB - now using live data */}
            <TabsContent value="notifications" className="p-4 space-y-4">
              <div>
                <h3 className="text-base font-semibold mb-3">Recent Notifications</h3>
                {loading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="flex items-start gap-3 border p-3 rounded-lg bg-white animate-pulse">
                        <div className="w-4 h-4 bg-gray-200 rounded mt-1"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded mb-1"></div>
                          <div className="h-3 bg-gray-200 rounded mb-1"></div>
                          <div className="h-3 bg-gray-200 rounded w-16"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : notifications.length > 0 ? (
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
                ) : (
                  <div className="text-center py-8">
                    <Bell className="h-12 w-12 mx-auto text-healthcare-300 mb-2" />
                    <h3 className="text-base font-semibold">No New Notifications</h3>
                    <p className="text-sm text-muted-foreground mt-1">You're all caught up!</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
