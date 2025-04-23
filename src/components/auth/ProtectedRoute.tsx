
import React from 'react';

type ProtectedRouteProps = {
  children: React.ReactNode;
};

// Authentication is bypassed for demo purposes
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // Directly render children, demo mode active
  console.log("Auth check bypassed - demo mode active");
  return <>{children}</>;
};

export default ProtectedRoute;
