import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RequireAdmin({ children }: { children: JSX.Element }) {
  const { profile } = useAuth();

  if (!profile?.is_admin) {
    return <Navigate to="/" replace />;
  }

  return children;
}
