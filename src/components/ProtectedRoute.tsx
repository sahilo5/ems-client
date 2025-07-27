import { Navigate, useLocation } from "react-router-dom";
import { JSX, useContext } from "react";
import Loader from "./Loader";
import React from "react";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }: { children: JSX.Element; allowedRoles: string[] }) => {
  const { isAuthenticated, role, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader size={48} color="text-primary" />
      </div>
    );
  }

  if (!isAuthenticated || !allowedRoles.includes(role || "")) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;
