

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
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { ConfirmEmailPage } from "./pages/auth/ConfirmEmailPage"
import { ThemeProvider } from "./context/ThemeContext"
import { DashboardProtectedRoute, PartialAuthRoute, PublicOnlyRoute } from "./ui/ProtectedRoute"
import NotFoundPage from "./pages/NotFoundPage"

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
      <ReactQueryDevtools initialIsOpen={false} />
      <ThemeProvider defaultTheme="system" storageKey="growtly-theme">
        <Router>
          <Routes>
            {/* Public-only Auth Routes (redirect if authenticated) */}
            <Route
              path="/signup"
              element={
                <PublicOnlyRoute>
                  <SignupPage />
                </PublicOnlyRoute>
              }
            />
            <Route
              path="/confirm-email"
              element={
                <PublicOnlyRoute>
                  <SignupConfirmationPage />
                </PublicOnlyRoute>
              }
            />
            <Route
              path="/login"
              element={
                <PublicOnlyRoute>
                  <LoginPage />
                </PublicOnlyRoute>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <PublicOnlyRoute>
                  <ForgotPasswordPage />
                </PublicOnlyRoute>
              }
            />
            <Route
              path="/reset-password"
              element={
                <PublicOnlyRoute>
                  <ResetPasswordPage />
                </PublicOnlyRoute>
              }
            />
            <Route
              path="/2fa-verification"
              element={
                <PublicOnlyRoute>
                  <TwoFactorPage />
                </PublicOnlyRoute>
              }
            />

            {/* Partial auth only route - for email confirmation */}
            <Route
              path="/confirm-email-page"
              element={
                <PartialAuthRoute>
                  <ConfirmEmailPage />
                </PartialAuthRoute>
              }
            />

            {/* Main App Routes (with AppLayout) */}
            <Route element={<AppLayout />}>
              {/* Public routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="mentors" element={<div className="p-8 text-center">Mentors page coming soon...</div>} />
              <Route
                path="communities"
                element={<div className="p-8 text-center">Communities page coming soon...</div>}
              />
              <Route
                path="how-it-works"
                element={<div className="p-8 text-center">How it works page coming soon...</div>}
              />
              <Route path="about" element={<div className="p-8 text-center">About page coming soon...</div>} />

              {/* Protected dashboard route - requires full authentication */}
              <Route
                path="dashboard"
                element={
                  <DashboardProtectedRoute>
                    <div className="p-8 text-center">Dashboard coming soon...</div>
                  </DashboardProtectedRoute>
                }
              />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  )

}

export default App

