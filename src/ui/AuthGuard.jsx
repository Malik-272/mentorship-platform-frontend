import { useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuthStatus } from "../hooks/useAuthStatus"

// Alternative approach using a guard component
export const AuthGuard = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { isLoading, isPartialAuth, isFullAuth, isGuest, canAccessDashboard, canAccessAuthPages, shouldConfirmEmail } =
    useAuthStatus()

  useEffect(() => {
    if (isLoading) return
    const currentPath = location.pathname

    // Dashboard access - requires full auth
    if (currentPath === "/dashboard" && !canAccessDashboard()) {
      if (shouldConfirmEmail()) {
        navigate("/confirm-email-page", { replace: true })
      } else {
        navigate("/login", { replace: true })
      }
      return
    }

    // Auth pages - only for guests or redirect full auth users
    const authPages = ["/login", "/signup", "/forgot-password", "/reset-password"]
    if (authPages.includes(currentPath)) {
      if (isFullAuth) {
        navigate("/dashboard", { replace: true })
        return
      }
      if (isPartialAuth) {
        navigate("/confirm-email", { replace: true })
        return
      }
    }

    // Email confirmation page - only for partial auth
    if (currentPath === "/confirm-email") {
      if (isGuest) {
        navigate("/login", { replace: true })
        return
      }
      if (isFullAuth) {
        navigate("/dashboard", { replace: true })
        return
      }
    }
  }, [
    isLoading,
    location.pathname,
    navigate,
    isPartialAuth,
    isFullAuth,
    isGuest,
    canAccessDashboard,
    shouldConfirmEmail,
  ])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return children
}
