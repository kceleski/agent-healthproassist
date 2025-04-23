
import React from 'react';

type ProtectedRouteProps = {
  children: React.ReactNode;
};

// TEMP: Auth is disabled for demo purposes!
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // Directly render children, do NOT check authentication
  return <>{children}</>;
};

export default ProtectedRoute;
