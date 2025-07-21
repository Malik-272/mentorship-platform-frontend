// src/context/AuthContext.jsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createContext, useContext } from "react";
import { jwtDecode } from "jwt-decode";
import { authApi } from "../services/authApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: authApi.getCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
  //   const decoded = jwtDecode(user?.token);
  console.log(" user:", user);
  let decoded = null;
  const tokenCookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="));

  if (tokenCookie) {
    const token = tokenCookie.split("=")[1];
    try {
      decoded = jwtDecode(token);
    } catch (err) {
      console.error("Failed to decode token:", err);
    }
  }

  const status = isError ? "none" : decoded?.partial ? "partial" : "full";

  const login = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["currentUser"]);
    },
  });

  const signup = useMutation({
    mutationFn: authApi.signup,
  });

  const logout = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      console.log("Logout successful");
      queryClient.clear();
    },
    onError: () => {
      queryClient.clear();
    },
  });

  const confirmEmail = useMutation({
    mutationFn: ({ code }) => authApi.confirmEmail(code),
    onSuccess: () => {
      queryClient.invalidateQueries(["currentUser"]);
    },
  });

  const resendVerification = useMutation({
    mutationFn: authApi.resendVerification,
  });

  const forgotPassword = useMutation({
    mutationFn: authApi.forgotPassword,
  });

  const resetPassword = useMutation({
    mutationFn: ({ token, newPassword }) =>
      authApi.resetPassword(token, newPassword),
  });

  const verify2FA = useMutation({
    mutationFn: authApi.verify2FA,
    onSuccess: (data) => {
      queryClient.setQueryData(["currentUser"], data.user);
    },
  });

  const resend2FA = useMutation({
    mutationFn: authApi.resend2FA,
  });

  return (
    <AuthContext.Provider
      value={{
        data: user,
        isLoading,
        isAuthenticated: status !== "none",
        status,
        login,
        logout,
        signup,
        confirmEmail,
        resendVerification,
        forgotPassword,
        resetPassword,
        verify2FA,
        resend2FA,
        refetchUser: refetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
