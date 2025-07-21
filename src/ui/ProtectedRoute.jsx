import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export const ProtectedRoute = ({ children }) => {
  const { status } = useAuth();
  if (status !== "full") return <Navigate to="/login" />;
  return children;
};

export const PartialAuthRoute = ({ children }) => {
  const { status } = useAuth();
  if (status === "none") return <Navigate to="/login" />;
  if (status === "full") return <Navigate to="/dashboard" />;
  return children; // allow partial only
};

export const PublicOnlyRoute = ({ children }) => {
  const { status } = useAuth();
  if (status === "full") return <Navigate to="/dashboard" />;
  if (status === "partial") return <Navigate to="/confirm-email" />;
  return children;
};

export function FullProtectedRoute({ children }) {
  const { status } = useAuth();
  if (status === "none") return <Navigate to="/login" />;
  if (status === "partial") return <Navigate to="/confirm-email" />;
  return children;
}
