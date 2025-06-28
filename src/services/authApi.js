const API_BASE_URL = "http://localhost:3000/api/v1"

// Auth API functions
export const authApi = {
  // Signup
  signup: async (userData) => {
    console.log("API: Sending signup request with data:", userData)

    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      console.log("API: Response status:", response.status)

      const data = await response.json()
      console.log("API: Response data:", data)

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`)
      }

      return data
    } catch (error) {
      console.error("API: Signup request failed:", error)

      // Handle network errors
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        throw new Error("Unable to connect to server. Please check your internet connection.")
      }

      throw error
    }
  },

  // Login
  login: async (credentials) => {
    console.log("API: Sending login request")

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
        credentials: "include",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Login failed")
      }

      return data
    } catch (error) {
      console.error("API: Login request failed:", error)

      if (error.name === "TypeError" && error.message.includes("fetch")) {
        throw new Error("Unable to connect to server. Please check your internet connection.")
      }

      throw error
    }
  },

  // Forgot Password
  forgotPassword: async (email) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to send reset email")
      }

      return data
    } catch (error) {
      console.error("API: Forgot password request failed:", error)

      if (error.name === "TypeError" && error.message.includes("fetch")) {
        throw new Error("Unable to connect to server. Please check your internet connection.")
      }

      throw error
    }
  },

  // Reset Password
  resetPassword: async (token, newPassword) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, newPassword }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Password reset failed")
      }

      return data
    } catch (error) {
      console.error("API: Reset password request failed:", error)

      if (error.name === "TypeError" && error.message.includes("fetch")) {
        throw new Error("Unable to connect to server. Please check your internet connection.")
      }

      throw error
    }
  },

  // Verify 2FA
  verify2FA: async (code) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-2fa`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
        credentials: "include",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "2FA verification failed")
      }

      return data
    } catch (error) {
      console.error("API: 2FA verification request failed:", error)

      if (error.name === "TypeError" && error.message.includes("fetch")) {
        throw new Error("Unable to connect to server. Please check your internet connection.")
      }

      throw error
    }
  },

  // Resend 2FA Code
  resend2FA: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/resend-2fa`, {
        method: "POST",
        credentials: "include",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to resend code")
      }

      return data
    } catch (error) {
      console.error("API: Resend 2FA request failed:", error)

      if (error.name === "TypeError" && error.message.includes("fetch")) {
        throw new Error("Unable to connect to server. Please check your internet connection.")
      }

      throw error
    }
  },
}
