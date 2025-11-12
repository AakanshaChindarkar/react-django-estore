// src/auth.js

// Saving access & refresh tokens + role
export function saveToken(token) {
  localStorage.setItem("access", token.access);
  localStorage.setItem("refresh", token.refresh);
  localStorage.setItem("role", token.role); // from backend
}

// Getting access token
export function getToken() {
  return localStorage.getItem("access");
}

// Removing tokens when user logs out
export function logout() {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("role");
}

// Checking login status
export function isLoggedIn() {
  return !!getToken();
}

// Get user role from localStorage
export function getUserRole() {
  return localStorage.getItem("role") || null;
}
