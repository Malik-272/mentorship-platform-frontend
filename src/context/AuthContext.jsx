// src/context/AuthContext.jsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createContext, useCallback, useContext, useEffect, useReducer } from "react";
import { jwtDecode } from "jwt-decode";
import { authApi } from "../services/authApi";

const AuthContext = createContext();
export const authInitialState = {
  user: null,
  status: "none", // 'none', 'partial', 'full'
  banned: false,
};

export const authReducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload };
    case "SET_STATUS":
      return { ...state, status: action.payload };
    case "RESET":
      return authInitialState;
    case "SET_BANNED":
      return { ...state, banned: action.payload }
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const [state, dispatch] = useReducer(authReducer, authInitialState);

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
    cacheTime: 10 * 60 * 1000,
  });

  const getUserStatus = useCallback(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      return "none";
    }
    let decoded;
    try {
      decoded = jwtDecode(token);
    } catch (err) {
      console.error("Failed to decode token:", err);
    }
    console.log(decoded);

    return decoded ? (decoded.partial ? "partial" : "full") : "none";
  }, []);

  const checkIfUserBanned = useCallback(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      return false;
    }
    let decoded = null;
    try {
      decoded = jwtDecode(token);
    } catch (err) {
      console.error("Failed to decode token:", err);
    }

    return decoded ? (decoded.banned ? true : false) : false;
  }, []);


  useEffect(() => {
    async function fetchData() {
      const { data: user } = await refetch();
      const userStatus = getUserStatus();

      if (userStatus === "none") {
        dispatch({ type: "SET_USER", payload: null });
        dispatch({
          type: "SET_STATUS",
          payload: "none",
        });
        return;
      }
      if (user) {
        dispatch({ type: "SET_USER", payload: user });
        dispatch({
          type: "SET_STATUS",
          payload: userStatus,
        });
      } else if (!user && checkIfUserBanned()) {
        dispatch({ type: "SET_STATUS", payload: userStatus })
        dispatch({ type: "SET_BANNED", payload: true });
      } else {
        dispatch({ type: "SET_USER", payload: null });
        dispatch({
          type: "SET_STATUS",
          payload: "none",
        });
      }
    }

    fetchData();
  }, [refetch, getUserStatus, checkIfUserBanned, dispatch]);

  const login = useMutation({
    mutationFn: authApi.login,
    onSuccess: async (data) => {
      localStorage.setItem('token', data.token);
      queryClient.invalidateQueries(["currentUser"]);
      const { data: user } = await refetch();
      dispatch({ type: "SET_STATUS", payload: getUserStatus() });
      dispatch({ type: "SET_BANNED", payload: checkIfUserBanned() });
      dispatch({ type: "SET_USER", payload: user });
    },
  });

  const signup = useMutation({
    mutationFn: authApi.signup,
    onSuccess: async () => {
      dispatch({ type: "SET_STATUS", payload: "partial" });
      const { data: user } = await refetch();
      dispatch({
        type: "SET_USER",
        payload: user,
      });
    },
  });

  const logout = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.clear();
      dispatch({ type: "RESET" });
      localStorage.removeItem("token");
    },
    onError: () => {
      localStorage.removeItem("token");
      queryClient.clear();
    },
  });

  const confirmEmail = useMutation({
    mutationFn: ({ code }) => authApi.confirmEmail(code),
    onSuccess: () => {
      queryClient.invalidateQueries(["currentUser"]);
      dispatch({ type: "SET_STATUS", payload: "full" });
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
        isError,
        isAuthenticated: state.status !== "none",
        status: state.status,
        banned: state.banned,

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
