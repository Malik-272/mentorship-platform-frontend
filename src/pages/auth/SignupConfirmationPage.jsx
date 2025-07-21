import { useLocation, Link } from "react-router-dom";
import { Mail, CheckCircle, ArrowRight, LogOut } from "lucide-react";
import Logo from "../../ui/Logo";
import { useAuth } from "../../context/AuthContext";
import { useSearchParams } from "react-router-dom";
export default function SignupConfirmationPage() {
  const location = useLocation();
  const email = location.state?.email || "your email";
  const { isAuthenticated, isLoading, logout: logoutMutation } = useAuth();
  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Sign Out Button */}
      {/* {isLoading ? (
        <div className="w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      ) :
        isAuthenticated && (
          <div className="absolute top-4 right-4">
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm leading-4 font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </button>
          </div >
        )
      } */}

      {/* Logo and Title */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Logo withLink={true} />
        </div>
      </div>

      {/* Confirmation Message */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-200 mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Check Your Email
          </h2>

          <div className="mb-6">
            <div className="flex items-center justify-center mb-4">
              <Mail className="h-12 w-12 text-blue-500" />
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              We've sent a confirmation email to:
            </p>
            <p className="font-medium text-gray-900 dark:text-white mb-4">
              {email}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Please check your inbox and click the confirmation link to
              activate your account.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-100 border border-blue-200 rounded-md p-4">
              <h3 className="text-sm font-medium text-blue-800 mb-2">
                What's next?
              </h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Check your email inbox (and spam folder)</li>
                <li>• Click the confirmation link</li>
                <li>• Complete your profile setup</li>
                <li>• Start connecting with mentors!</li>
              </ul>
            </div>

            <div className="flex flex-col space-y-3">
              {/* <Link
                to="/login"
                className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Go to Login
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link> */}

              {isLoading ? (
                <div className="w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              ) : (
                isAuthenticated && (
                  <button
                    onClick={handleLogout}
                    className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </button>
                )
              )}
              {/* <button
                onClick={() => window.location.reload()}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Resend Confirmation Email
              </button> */}
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Didn't receive the email? Check your spam folder or{" "}
              <Link
                to="/contact"
                className="text-blue-600 hover:text-blue-500 dark:hover:text-blue-400"
              >
                contact support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
