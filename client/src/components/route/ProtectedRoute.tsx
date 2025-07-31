import React from "react";
import { Navigate } from "react-router-dom";
import userStore from "@/store/userStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[]; // List of roles allowed on this route
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user } = userStore(); 


  if (!user?.role) {
    // Not logged in → redirect to login
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Role not allowed → redirect to unauthorized page
    return <Navigate to="/notFound" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
