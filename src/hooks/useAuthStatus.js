import { useAuth } from "./useAuth"

// Helper hook to get detailed auth status
export const useAuthStatus = () => {
  const { isAuthenticated, isLoading, partial, data } = useAuth()

  return {
    isAuthenticated,
    isLoading,
    isPartialAuth: isAuthenticated && partial,
    isFullAuth: isAuthenticated && !partial,
    isGuest: !isAuthenticated,
    userData: data,
    // Helper methods
    canAccessDashboard: () => isAuthenticated && !partial,
    canAccessAuthPages: () => !isAuthenticated,
    shouldConfirmEmail: () => isAuthenticated && partial,
  }
}
