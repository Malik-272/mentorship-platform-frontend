import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "./context/ThemeContext";
import {
  FullProtectedRoute,
  FullProtectedRouteWithRole,
  PartialAuthRoute,
  PublicOnlyRoute,
} from "./ui/ProtectedRoute";

import { lazy } from "react";
import { AuthProvider } from "./context/AuthContext";
import CreateCommunityPage from "./pages/CreateCommunityPage";
import ManageCommunityPage from "./pages/ManageCommunityPage";
import CommunityManagerOnlyFallback from "./ui/CommunityManagerOnlyFallback";
import CommunitySettingsPage from "./pages/CommunitySettingsPage";
import UnauthorizedAccessFallback from "./ui/UnauthorizedAccessFallback";
import UserCommunitiesPage from "./pages/UserCommunitiesPage";
import MentorServicesPage from "./pages/mentor/MentorServicesPage";
import SessionRequestsPage from "./pages/mentor/SessionRequestsPage";
import CreateServicePage from "./pages/CreateServicePage";
import ServiceManagementPage from "./pages/ServiceManagementPage";
const AppLayout = lazy(() => import("./ui/AppLayout"));
const LandingPage = lazy(() => import("./pages/LandingPage"));

// Auth Pages

const SignupPage = lazy(() => import("./pages/auth/SignUpPage"));
const SignupConfirmationPage = lazy(() =>
  import("./pages/auth/SignupConfirmationPage")
);
const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const ForgotPasswordPage = lazy(() =>
  import("./pages/auth/ForgotPasswordPage")
);
const ResetPasswordPage = lazy(() => import("./pages/auth/ResetPasswordPage"));
const TwoFactorPage = lazy(() => import("./pages/auth/TwoFactorPage"));
const ConfirmEmailPage = lazy(() => import("./pages/auth/ConfirmEmailPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const PersonalInfoSection = lazy(() =>
  import("./features/settings/PersonalInfoSection")
);
const SecuritySection = lazy(() =>
  import("./features/settings/SecuritySection")
);
const ConnectionsSection = lazy(() =>
  import("./features/settings/ConnectionsSection")
);
const UserProfilePage = lazy(() => import("./pages/UserProfilePage"));
const CommunityPage = lazy(() => import("./pages/CommunityPage"));
const MenteeSessionRequestsPage = lazy(() => import("./pages/mentee/MenteeSessionRequestsPage"))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <ThemeProvider defaultTheme="system" storageKey="growtly-theme">
        <AuthProvider>
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
                path="/successful-registration"
                element={
                  <PartialAuthRoute>
                    <SignupConfirmationPage />
                  </PartialAuthRoute>
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
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/2fa-verification" element={<TwoFactorPage />} />

              {/* Partial auth only route - for email confirmation */}
              <Route
                path="/confirm-email"
                element={<ConfirmEmailPage />}
              />

              {/* Main App Routes (with AppLayout) */}

              <Route element={<AppLayout />}>
                {/* Public routes */}
                <Route path="/" element={<LandingPage />} />
                <Route
                  path="mentors"
                  element={
                    <div className="p-8 text-center">
                      Mentors page coming soon...
                    </div>
                  }
                />
                <Route
                  path="communities"
                  element={
                    <div className="p-8 text-center">
                      Communities page coming soon...
                    </div>
                  }
                />
                <Route
                  path="how-it-works"
                  element={
                    <div className="p-8 text-center">
                      How it works page coming soon...
                    </div>
                  }
                />
                <Route
                  path="about"
                  element={
                    <div className="p-8 text-center">
                      About page coming soon...
                    </div>
                  }
                />

                {/* Protected dashboard route - requires full authentication */}

                <Route
                  path="dashboard"
                  element={
                    <FullProtectedRoute>
                      <div className="p-8 text-center">
                        Dashboard coming soon...
                      </div>
                    </FullProtectedRoute>
                  }
                />
                <Route
                  path="/profile/:id"
                  element={
                    <FullProtectedRoute>
                      <UserProfilePage />
                    </FullProtectedRoute>
                  }
                />
                <Route
                  path="my/settings"
                  element={
                    <FullProtectedRoute>
                      <SettingsPage />
                    </FullProtectedRoute>
                  }
                >
                  <Route index element={<Navigate to="personal" replace />} />

                  {/* Subroutes */}
                  <Route path="personal" element={<PersonalInfoSection />} />
                  <Route path="security" element={<SecuritySection />} />
                  <Route path="connections" element={<ConnectionsSection />} />
                </Route>
                <Route
                  path="my/communities"
                  element={
                    <FullProtectedRouteWithRole
                      roles={["MENTEE", "MENTOR"]}
                      fallback={<UnauthorizedAccessFallback />}
                    >
                      <UserCommunitiesPage />
                    </FullProtectedRouteWithRole>
                  }
                />
                <Route
                  path="/communities/create"
                  element={
                    <FullProtectedRouteWithRole
                      roles={["COMMUNITY_MANAGER"]}
                      fallback={<CommunityManagerOnlyFallback />}
                    >
                      <CreateCommunityPage />
                    </FullProtectedRouteWithRole>
                  }
                />
                <Route
                  path="/communities/my/manage"
                  element={
                    <FullProtectedRouteWithRole
                      roles={["COMMUNITY_MANAGER"]}
                      fallback={<CommunityManagerOnlyFallback />}
                    >
                      <ManageCommunityPage />
                    </FullProtectedRouteWithRole>
                  }
                />
                <Route
                  path="/communities/my/settings"
                  element={
                    <FullProtectedRouteWithRole
                      roles={["COMMUNITY_MANAGER"]}
                      fallback={<CommunityManagerOnlyFallback />}
                    >
                      <CommunitySettingsPage />
                    </FullProtectedRouteWithRole>
                  }
                />
                <Route path="/communities/:id" element={<CommunityPage />} />
                <Route
                  path="/services/create"
                  element={
                    <FullProtectedRouteWithRole
                      roles={["MENTOR"]}
                      fallback={<UnauthorizedAccessFallback />}
                    >
                      <CreateServicePage />
                    </FullProtectedRouteWithRole>
                  }
                />
                <Route
                  path="/my/services/:id"
                  element={
                    <FullProtectedRouteWithRole
                      roles={["MENTOR"]}
                      fallback={<UnauthorizedAccessFallback />}
                    >
                      <ServiceManagementPage />
                    </FullProtectedRouteWithRole>
                  }
                />
                <Route
                  path="my/services"
                  element={
                    <FullProtectedRouteWithRole
                      roles={["MENTOR"]}
                      fallback={<UnauthorizedAccessFallback />}>
                      <MentorServicesPage />
                    </FullProtectedRouteWithRole>
                  }
                />
                <Route
                  path="my/services/:id/session-requests"
                  element={
                    <FullProtectedRouteWithRole
                      roles={["MENTOR"]}
                      fallback={<UnauthorizedAccessFallback />}>
                      <SessionRequestsPage />
                    </FullProtectedRouteWithRole>
                  }
                />
                <Route path="my/session-requests" element={<MenteeSessionRequestsPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
    // </ProtectedRoute>
  );
}

export default App;
