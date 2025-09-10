import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

export const ProtectedRoute = ({ children }) => {
  const { status, isLoading } = useAuth();
  if (isLoading) return null;
  if (status !== "full") return <Navigate to="/login" />;
  return children;
};

export const PartialAuthRoute = ({ children }) => {
  const { status, isLoading } = useAuth();
  if (isLoading)
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  if (status === "none") return <Navigate to="/login" />;
  if (status === "full") return <Navigate to="/dashboard" />;
  return children; // allow partial only
};

export const PublicOnlyRoute = ({ children }) => {
  const { status, isLoading } = useAuth();
  if (isLoading)
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  if (status === "full") return <Navigate to="/dashboard" />;
  if (status === "partial") return <Navigate to="/successful-registration" />;
  return children;
};

export function FullProtectedRoute({ children }) {
  const { status, isLoading, banned } = useAuth();
  if (isLoading)
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  if (status === "none") return <Navigate to="/login" />;
  if (status === "partial") return <Navigate to="/successful-registration" />;
  if (banned) return <Navigate to= "/banned"/>;
  return children;
};

export function FullProtectedRouteWithRole({
  children,
  roles = [],
  fallback,
}) {
  const { status, isLoading, data, banned } = useAuth();
  if (isLoading)
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  if (status === "none") return <Navigate to="/login" />;
  if (status === "partial") return <Navigate to="/successful-registration" />;
  if (banned) return <Navigate to= "/banned"/>;
  if (status === "full" && !roles.includes(data?.user?.role)) return fallback;
  return children;
};
