
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

type ProtectedRouteProps = {
  children: React.ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  
  // Use environment variable to bypass authentication in development
  const isDevelopment = import.meta.env.DEV;

  console.log("Protected Route Check:", { 
    path: location.pathname,
    isAuthenticated, 
    isDevelopment, 
    loading,
    userStatus: 'checking access'
  });

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

  // For development, allow access even if not authenticated
  if (!isAuthenticated && !isDevelopment) {
    console.log("Access denied - redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // In development or when authenticated, render children
  console.log("Access granted to protected route");
  return <>{children}</>;
};

export default ProtectedRoute;
