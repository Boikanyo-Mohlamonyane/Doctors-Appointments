import React from "react";
import { Navigate } from "react-router-dom";
import { isTokenExpired, logout } from "../utils/auth";


export default function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  // ❌ NO TOKEN
  if (!token) {
    return <Navigate to="/" />;
  }

  // ❌ TOKEN EXPIRED
  if (isTokenExpired(token)) {
    logout();
    return <Navigate to="/" />;
  }

  // ❌ WRONG ROLE
  if (role && userRole !== role) {
    return <Navigate to="/" />;
  }

  // ✅ ALLOW ACCESS
  return children;
}