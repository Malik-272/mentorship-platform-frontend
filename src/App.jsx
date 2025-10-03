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

import { Toaster } from "react-hot-toast";
import { lazy } from "react";
import { AuthProvider } from "./context/AuthContext";
import CreateCommunityPage from "./pages/CreateCommunityPage";
import ManageCommunityPage from "./pages/ManageCommunityPage";
import CommunityManagerOnlyFallback from "./ui/CommunityManagerOnlyFallback";
import BannedUserPage from "./pages/auth/BannedUserPage";
import CommunitySettingsPage from "./pages/CommunitySettingsPage";
import UnauthorizedAccessFallback from "./ui/UnauthorizedAccessFallback";
import UserCommunitiesPage from "./pages/UserCommunitiesPage";
import MentorServicesPage from "./pages/mentor/MentorServicesPage";
import SessionRequestsPage from "./pages/mentor/SessionRequestsPage";
import CreateServicePage from "./pages/CreateServicePage";
import ServiceManagementPage from "./pages/ServiceManagementPage";
import ServiceBookingPage from "./pages/ServiceBookingPage";
import UserReportsPage from "./pages/admin/UserReportsPage";
import UserPreviewPage from "./pages/admin/UserPreviewPage";
import DashboardPage from "./pages/DashboardPage";
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
const MenteeSessionRequestsPage = lazy(() =>
  import("./pages/mentee/MenteeSessionRequestsPage")
);
const BannedUsersPage = lazy(() => import("./pages/admin/BannedUsersPage"));

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
          <Toaster position="top-right"
            toastOptions={{
              success: {
                iconTheme: {
                  primary: "#7C3AED",   // blue checkmark
                  secondary: "#EFF6FF", // light blue background
                },
              },
            }}
          />
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
            <Route path="/2fa-verification" element={<TwoFactorPage />} />

            {/* Partial auth only route - for email confirmation */}
            <Route
              path="/confirm-email"
              element={
                <PartialAuthRoute>
                  <ConfirmEmailPage />
                </PartialAuthRoute>
              }
            />

            {/* Main App Routes (with AppLayout) */}

            <Route element={<AppLayout />}>
              {/* Public routes */}
              <Route path="/" element={
                <PublicOnlyRoute>
                  <LandingPage />
                </PublicOnlyRoute>
              } />

              {/* Protected dashboard route - requires full authentication */}

              <Route
                path="dashboard"
                element={
                  <FullProtectedRoute>
                    {/* <div className="p-8 text-center">
                      Dashboard coming soon...
                    </div> */}
                    <DashboardPage />
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
              <Route
                path="/communities/:id"
                element={
                  <FullProtectedRoute>
                    <CommunityPage />
                  </FullProtectedRoute>
                }
              />
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
                    fallback={<UnauthorizedAccessFallback />}
                  >
                    <MentorServicesPage />
                  </FullProtectedRouteWithRole>
                }
              />
              <Route
                path="my/services/:id/session-requests"
                element={
                  <FullProtectedRouteWithRole
                    roles={["MENTOR"]}
                    fallback={<UnauthorizedAccessFallback />}
                  >
                    <SessionRequestsPage />
                  </FullProtectedRouteWithRole>
                }
              />
              <Route
                path="/users/:userId/services/:serviceId/book"
                element={
                  <FullProtectedRouteWithRole
                    roles={["MENTEE"]}
                    fallback={<UnauthorizedAccessFallback />}
                  >
                    <ServiceBookingPage />
                  </FullProtectedRouteWithRole>
                }
              />
              <Route
                path="my/session-requests"
                element={
                  <FullProtectedRouteWithRole
                    roles={["MENTEE"]}
                    fallback={<UnauthorizedAccessFallback />}
                  >
                    <MenteeSessionRequestsPage />
                  </FullProtectedRouteWithRole>
                }
              />
              <Route

                path="/banned"
                element={
                  <BannedUserPage />
                } />
              <Route
                path="management/user-reports"
                element={
                  <FullProtectedRouteWithRole
                    roles={["ADMIN"]}
                    fallback={<UnauthorizedAccessFallback />}
                  >
                    <UserReportsPage />
                  </FullProtectedRouteWithRole>

                }
              />
              <Route
                path="management/banned-users"
                element={
                  <FullProtectedRouteWithRole
                    roles={["ADMIN"]}
                    fallback={<UnauthorizedAccessFallback />}
                  >
                    <BannedUsersPage />
                  </FullProtectedRouteWithRole>
                }
              />
              <Route
                path="management/users"
                element={
                  <FullProtectedRouteWithRole
                    roles={["ADMIN"]}
                    fallback={<UnauthorizedAccessFallback />}
                  >
                    <UserPreviewPage />
                  </FullProtectedRouteWithRole>
                }
              />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
