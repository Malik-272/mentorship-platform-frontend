import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Loader2 } from "lucide-react"
import { useAuth } from "../hooks/useAuth"

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
    <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
    <p className="text-gray-600">Checking authentication...</p>
  </div>
)

export default function ProtectedRoute({ children }) {
  const navigate = useNavigate();

  const { isAuthenticated } = useAuth();

  useEffect(function () {
    if (!isAuthenticated) navigate("/login")
  }, [isAuthenticated, navigate]);

  if (isAuthenticated) return children;
}
