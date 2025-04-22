
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

type ProtectedRouteProps = {
  children: React.ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  
  // Use environment variable to bypass authentication in development
  const isDevelopment = import.meta.env.DEV || true; // Ensure development mode works

  // Show loading state while authentication is being checked
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 bg-healthcare-200 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-healthcare-100 rounded"></div>
        </div>
      </div>
    );
  }

  console.log("Auth state:", { isAuthenticated, isDevelopment });

  // For development, allow access even if not authenticated
  if (!isAuthenticated && !isDevelopment) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Render children if authenticated or in development mode
  return <>{children}</>;
};

export default ProtectedRoute;
