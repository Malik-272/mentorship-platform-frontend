import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

export const ProtectedRoute = ({
  children,
  requireFullAuth = false,
  allowPartialAuth = false,
  redirectTo = "/login",
}) => {
  const { isAuthenticated, isLoading, partial } = useAuth()
  const location = useLocation()

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Not authenticated at all
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  // Partial authentication handling
  if (partial) {
    // If route allows partial auth, let them through
    if (allowPartialAuth) {
      return children
    }

    // If route requires full auth and user is partial, redirect to confirm email
    if (requireFullAuth) {
      return <Navigate to="/confirm-email-page" replace />
    }
  }

  // Full authentication - check if they should be restricted from auth pages
  if (
    !partial &&
    (location.pathname === "/login" ||
      location.pathname === "/signup" ||
      location.pathname === "/confirm-email" ||
      location.pathname === "/confirm-email-page")
  ) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

// Specific route protection components for clarity
export const DashboardProtectedRoute = ({ children }) => (
  <ProtectedRoute requireFullAuth={true}>{children}</ProtectedRoute>
)

export const PartialAuthRoute = ({ children }) => (
  <ProtectedRoute allowPartialAuth={true} requireFullAuth={false}>
    {children}
  </ProtectedRoute>
)

export const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated, isLoading, partial } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // If fully authenticated, redirect to dashboard
  if (isAuthenticated && !partial) {
    return <Navigate to="/dashboard" replace />
  }

  // If partially authenticated, only allow confirm email page
  if (isAuthenticated && partial) {
    if (location.pathname === "/confirm-email-page") {
      return children
    }
    return <Navigate to="/confirm-email-page" replace />
  }

  return children
}
