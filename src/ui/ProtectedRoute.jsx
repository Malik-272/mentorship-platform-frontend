// components/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

export const ProtectedRoute = ({ children, requireFullAuth = false }) => {
  const { isAuthenticated, partial, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <div>Loading...</div> // Or your loading spinner
  }

  // Not authenticated at all
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />

  }

  // Authenticated but requires full auth and user is partial
  if (requireFullAuth && partial) {
    return <Navigate to="/confirm-email" state={{ from: location }} replace />
  }

  return children
}