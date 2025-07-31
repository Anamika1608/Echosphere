import React from "react";
import { Navigate } from "react-router-dom";
import userStore from "@/store/userStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user } = userStore(); 
  
  if (!user || !user.id || !user.role) {
    return <Navigate to="/" replace />;
  }
  
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/notFound" replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;