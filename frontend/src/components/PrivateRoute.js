// src/components/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { isLoggedIn, getUserRole } from "../auth";

export default function PrivateRoute({ children, adminOnly = false }) {
  if (!isLoggedIn()) return <Navigate to="/login" />;

  const role = getUserRole();

  if (adminOnly && role !== "admin") {
    // Admin-only route but user is not admin → redirect to home
    return <Navigate to="/" />;
  }

  if (!adminOnly && role === "admin") {
    // Optional: redirect admin away from customer pages
    return <Navigate to="/admin" />;
  }

  return children;
}
