import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AuthProvider } from "@/context/AuthContext";
import { Helmet } from "react-helmet";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import UnifiedRegisterPage from "./pages/UnifiedRegisterPage";
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
import DirectoryPage from "./pages/DirectoryPage"; // Import the DirectoryPage

// Layout
import MainLayout from "./components/layouts/MainLayout";
import DashboardLayout from "./components/layouts/DashboardLayout";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

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
              {/* Redirect root to landing page */}
              <Route path="/" element={<Navigate to="/landing" replace />} />
              
              {/* Public routes */}
              <Route element={<MainLayout />}>
                <Route path="/landing" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<UnifiedRegisterPage />} />
                <Route path="/ava-logo" element={<AvaLogoDemo />} />
                <Route path="/index" element={<Index />} />
                <Route path="/welcome" element={<WelcomePage />} />
              </Route>
              
              {/* Protected routes */}
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
                
                {/* ADD THIS ROUTE FOR YOUR DIRECTORY */}
                <Route path="/directory" element={<ProtectedRoute><DirectoryPage /></ProtectedRoute>} />

                <Route path="/map" element={<ProtectedRoute><MapPage /></ProtectedRoute>} />
                <Route path="/favorites" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
                <Route path="/saved-searches" element={<ProtectedRoute><SavedSearchesPage /></ProtectedRoute>} />
                <Route path="/facilities" element={<ProtectedRoute><FacilitiesPage /></ProtectedRoute>} />
                <Route path="/facilities/:id" element={<ProtectedRoute><FacilityDetailPage /></ProtectedRoute>} />
                <Route path="/contacts" element={<ProtectedRoute><ContactsPage /></ProtectedRoute>} />
                <Route path="/payments" element={<ProtectedRoute><PaymentsPage /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                <Route path="/calendar" element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} />
                <Route path="/medical-records" element={<ProtectedRoute><ClientMedicalRecordsPage /></ProtectedRoute>} />
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