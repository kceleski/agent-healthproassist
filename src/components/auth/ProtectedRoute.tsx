
import React from 'react';

type ProtectedRouteProps = {
  children: React.ReactNode;
};

// TEMP: Auth is completely disabled for demo purposes!
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // Directly render children, do NOT check authentication
  console.log("Auth check bypassed - demo mode active");
  return <>{children}</>;
};

export default ProtectedRoute;
