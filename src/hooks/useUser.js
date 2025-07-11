// hooks/useUser.js
import { useQuery } from "@tanstack/react-query"
import { jwtDecode } from "jwt-decode"

export const useUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: () => {
      // Check if we have a token in localStorage
      const token = localStorage.getItem("token")
      if (!token) return null

      // Parse the token to get user info (you might want to use jwt-decode library)
      try {
        // Decode the JWT token to get user information
        const payload = jwtDecode(token)
        console.log("Decoded payload:", payload)

        return {
          isAuthenticated: true,
          isPartial: payload.partial || false,
          ...payload
        }
      } catch (error) {
        console.error("Error parsing token:", error)
        return null
      }
    },
    staleTime: 1000 * 60 * 5 // 5 minutes
  })
}