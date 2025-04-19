
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
import SearchPage from "./pages/SearchPage";
import MapPage from "./pages/MapPage";
import FavoritesPage from "./pages/FavoritesPage";
import ContactsPage from "./pages/ContactsPage";
import PaymentsPage from "./pages/PaymentsPage";
import ProfilePage from "./pages/ProfilePage";
import CalendarPage from "./pages/CalendarPage";
import AvaLogoDemo from "./pages/AvaLogoDemo";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import SavedSearchesPage from "./pages/SavedSearchesPage";
import ClientMedicalRecordsPage from "./pages/ClientMedicalRecordsPage";
import WelcomePage from "./pages/WelcomePage";

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
                <Route path="/search" element={<SearchPage />} />
                <Route path="/map" element={<MapPage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="/saved-searches" element={<SavedSearchesPage />} />
                <Route path="/facilities" element={<FavoritesPage />} />
                <Route path="/facilities/:id" element={<FacilityDetailPage />} />
                <Route path="/contacts" element={<ContactsPage />} />
                <Route path="/payments" element={<PaymentsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="/medical-records" element={<ClientMedicalRecordsPage />} />
                <Route path="/welcome" element={<WelcomePage />} />
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
