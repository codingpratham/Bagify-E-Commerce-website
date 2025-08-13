// components/ProtectedRoute.tsx
import type { JSX } from "react";

import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles?: ("USER" | "ADMIN")[];
}

export const ProtectedRoutes = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const authString = localStorage.getItem("user");
  const auth = authString ? JSON.parse(authString) : null;
  
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  
  if (!auth) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(auth.role)) {
    return <Navigate to="/register" replace />;
  }
  
  if(!user?.isOnBoarded) {
    return <Navigate to="/onboard" replace />;
  }
  
  return children;
};
