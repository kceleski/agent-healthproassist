
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AuthProvider } from "@/context/AuthContext";
import { Helmet } from "react-helmet";

// Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import FacilitiesPage from "./pages/FacilitiesPage";
import FacilityDetailPage from "./pages/FacilityDetailPage";
import FacilitySearchPage from "./pages/FacilitySearchPage";
import ContactsPage from "./pages/ContactsPage";
import PaymentsPage from "./pages/PaymentsPage";
import ProfilePage from "./pages/ProfilePage";
import MapPage from "./pages/MapPage";
import CalendarPage from "./pages/CalendarPage";
import AvaLogoDemo from "./pages/AvaLogoDemo";
import AvaMapPage from "./pages/AvaMapPage";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";

// Layout
import MainLayout from "./components/layouts/MainLayout";
import DashboardLayout from "./components/layouts/DashboardLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <SidebarProvider>
          <Helmet>
            <title>HealthProAssist - AI Health Assistant</title>
          </Helmet>
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/ava-logo" element={<AvaLogoDemo />} />
                <Route path="/index" element={<Index />} />
              </Route>
              
              {/* Protected routes */}
              <Route element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/facilities" element={<FacilitiesPage />} />
                <Route path="/facilities/:id" element={<FacilityDetailPage />} />
                <Route path="/facility-search" element={<FacilitySearchPage />} />
                <Route path="/contacts" element={<ContactsPage />} />
                <Route path="/payments" element={<PaymentsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/map" element={<MapPage />} />
                <Route path="/ava-map" element={<AvaMapPage />} />
                <Route path="/calendar" element={<CalendarPage />} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </SidebarProvider>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
