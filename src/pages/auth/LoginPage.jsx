import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";

import FormField from "../../features/Authenticaion/FormField";
import Logo from "../../ui/Logo";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const location = useLocation();
  const message = location.state?.message;
  const navigate = useNavigate();
  const { login: loginMutation, status, setStatus } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    console.log("Login data:", data)
    try {
      const result = await loginMutation.mutateAsync(data);

      if (status === "partial") {
        // Partial user — redirect to confirm email

        navigate("/confirm-email", {
          state: {
            message: "Please confirm your email to proceed.",
          },
        });
      } else {
        // Fully authenticated user
        console.log("Login successful:", status);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login failed:", error);
      // Optionally show a user-friendly error message
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Logo withLink={true} />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900 dark:text-white">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Sign up for free
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Success Message */}
          {message && (
            <div className="mb-6 rounded-md bg-green-50 dark:bg-green-900 p-4">
              <div className="text-sm text-green-700 dark:text-green-200">
                {message}
              </div>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <FormField
              label="Email"
              name="email"
              placeholder="Enter your email"
              register={register}
              error={errors.email}
              rules={{ required: "Email is required" }}
            />

            <FormField
              label="Password"
              name="password"
              type="password"
              placeholder="Enter your password"
              register={register}
              error={errors.password}
              rules={{ required: "Password is required" }}
              showPasswordToggle={true}
            />

            <div className="flex items-center justify-between">
              {/* <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 dark:bg-gray-700 dark:border-gray-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-200">
                  Remember me
                </label>
              </div> */}

              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || loginMutation.isPending}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isSubmitting || loginMutation.isPending
                ? "Signing in..."
                : "Sign in"}
            </button>

            {/* Error */}
            {loginMutation.error && (
              <div className="rounded-md bg-red-50 dark:bg-red-900 p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <div className="ml-3 text-sm text-red-700 dark:text-red-300">
                    {loginMutation.error.message}
                  </div>
                </div>
              </div>
            )}
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  New to Growtly?
                </span>
              </div>
            </div>
            <div className="mt-6">
              <Link
                to="/signup"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Create your account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
