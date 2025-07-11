import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { authApi } from "../services/authApi"
import { useNavigate } from "react-router-dom"
import { getSessionType, setSessionType } from "./useSessionType"
import { jwtDecode } from "jwt-decode"

// Hook to get current user
export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: authApi.getCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  })
}

export const useAuth = () => {
  const { data, isLoading, isError } = useCurrentUser()
  const partial = getSessionType();
  return {
    data,
    isAuthenticated: !isError && !!data,
    isLoading,
    isError,
    partial
  }
}

export const useSignup = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: authApi.signup,
    onSuccess: (data) => {
      console.log("Signup successful:", data)
      setSessionType(1);
      navigate("/confirm-email", {
        state: {
          email: data.email || "your email",
        },
      })
    },
    onError: (error) => {
      console.error("Signup error:", error)
      // Error is handled by the component
    },
  })
}

export const useLogin = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      console.log("Login successful:", data)
      const partial = setSessionType(jwtDecode(data.token).partial);
      if (partial) {
        navigate("/confirm-email", {
          state: {
            message: "Please complete your profile to access the dashboard.",
          },
        })
      } else if (data.requires2FA) {
        navigate("/2fa-verification")
      } else {
        queryClient.setQueryData(["user"], data.user)
        navigate("/", { replace: true })
      }
    },
    onError: (error) => {
      console.error("Login error:", error)
      // Error is handled by the component
    },
  })
}

export const useConfirmEmail = () => {
  return useMutation({
    mutationFn: ({ code }) => authApi.confirmEmail(code),
    onSuccess: (data) => {
      console.log("Email confirmation successful:", data)
      // Optionally, you can redirect or show a success message
      setSessionType(0)
    },
    onError: (error) => {
      console.error("Email confirmation error:", error)
      // Error is handled by the component
    },
  })
}

export const useLogout = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      // Clear all cached data
      queryClient.clear()
      navigate("/login", { replace: true })
      localStorage.removeItem("Partial")
    },
    onError: (error) => {
      console.error("Logout error:", error)
      // Even if logout fails on server, clear local cache
      queryClient.clear()
      navigate("/login", { replace: true })
      localStorage.removeItem("Partial")
    },
  })
}

export const useResendVerification = () => {
  return useMutation({
    mutationFn: authApi.resendVerification,
    onError: (error) => {
      console.error("Resend verification error:", error)
    },
  })
}

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: authApi.forgotPassword,
    onError: (error) => {
      console.error("Forgot password error:", error)
      // Error is handled by the component
    },
  })
}

export const useResetPassword = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: ({ token, newPassword }) => authApi.resetPassword(token, newPassword),
    onSuccess: () => {
      navigate("/login", {
        state: {
          message: "Password reset successfully. Please log in with your new password.",
        },
      })
    },
    onError: (error) => {
      console.error("Reset password error:", error)
      // Error is handled by the component
    },
  })
}

export const useVerify2FA = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authApi.verify2FA,
    onSuccess: (data) => {
      console.log("2FA verification successful:", data)
      queryClient.setQueryData(["user"], data.user)
      navigate("/dashboard")
    },
    onError: (error) => {
      console.error("2FA verification error:", error)
      // Error is handled by the component
    },
  })
}

export const useResend2FA = () => {
  return useMutation({
    mutationFn: authApi.resend2FA,
    onError: (error) => {
      console.error("Resend 2FA error:", error)
      // Error is handled by the component
    },
  })
}
