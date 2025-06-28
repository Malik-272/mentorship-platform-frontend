

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import AppLayout from "./ui/AppLayout"
import LandingPage from "./pages/LandingPage"

// Auth Pages
import SignupPage from "./pages/auth/SignUpPage"
import SignupConfirmationPage from "./pages/auth/SignupConfirmationPage"
import LoginPage from "./pages/auth/LoginPage"
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage"
import ResetPasswordPage from "./pages/auth/ResetPasswordPage"
import TwoFactorPage from "./pages/auth/TwoFactorPage"

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Auth Routes (without AppLayout) */}
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/signup-confirmation" element={<SignupConfirmationPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/2fa-verification" element={<TwoFactorPage />} />

          {/* Main App Routes (with AppLayout) */}
          <Route
            path="/*"
            element={
              <AppLayout>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/mentors" element={<div className="p-8 text-center">Mentors page coming soon...</div>} />
                  <Route
                    path="/communities"
                    element={<div className="p-8 text-center">Communities page coming soon...</div>}
                  />
                  <Route
                    path="/how-it-works"
                    element={<div className="p-8 text-center">How it works page coming soon...</div>}
                  />
                  <Route path="/about" element={<div className="p-8 text-center">About page coming soon...</div>} />
                  <Route path="/dashboard" element={<div className="p-8 text-center">Dashboard coming soon...</div>} />
                </Routes>
              </AppLayout>
            }
          />
        </Routes>
      </Router>
    </QueryClientProvider>
  )

}

export default App
