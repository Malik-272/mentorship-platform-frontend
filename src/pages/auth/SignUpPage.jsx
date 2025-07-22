import { useState } from "react";
import { set, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { User, UserCheck, AlertCircle, Shield } from "lucide-react";
import { validationRules, countryCodes } from "../../data/authData";
import FormField from "../../features/Authenticaion/FormField";
import PasswordStrengthIndicator from "../../features/Authenticaion/PasswordStrengthIndicator";
import Logo from "../../ui/Logo";
import { useAuth } from "../../context/AuthContext";
import { jwtDecode } from "jwt-decode";

export default function SignupPage() {
  const [selectedRole, setSelectedRole] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      id: "",
      email: "",
      headline: "",
      password: "",
      country: "",
      role: "",
    },
  });
  const { signup: signupMutation, status, setStatus } = useAuth();
  const watchPassword = watch("password", "");
  const navigate = useNavigate();
  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setValue("role", role, { shouldValidate: true });
  };

  const onSubmit = async (data) => {
    try {
      const result = await signupMutation.mutateAsync(data);
      if (result.status === "Success") {
        navigate("/confirm-email", {
          state: {
            email: result?.email || data.email,
          },
        });
      }
    } catch (error) {
      console.error("Signup failed:", error);
      // show error feedback to user
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Logo withLink={true} />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900 dark:text-white">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <FormField
              label="Full Name"
              name="name"
              placeholder="Enter your full name"
              register={register}
              error={errors.name}
              rules={validationRules.name}
            />

            <FormField
              label="Username"
              name="id"
              placeholder="Choose a username"
              register={register}
              error={errors.id}
              rules={validationRules.id}
            />

            <FormField
              label="Email Address"
              name="email"
              type="email"
              placeholder="Enter your email"
              register={register}
              error={errors.email}
              rules={validationRules.email}
            />

            <FormField
              label="Professional Headline"
              name="headline"
              placeholder="e.g., Software Engineer at Google"
              register={register}
              error={errors.headline}
              rules={validationRules.headline}
            />

            <FormField
              label="Country"
              name="country"
              register={register}
              error={errors.country}
              rules={validationRules.country}
            >
              <select
                {...register("country", validationRules.country)}
                className={`w-full px-3 py-2 border rounded-md shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.country
                    ? "border-red-300"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              >
                <option value="">Select your country</option>
                {Object.entries(countryCodes).map(([key, country]) => (
                  <option key={key} value={key}>
                    {country}
                  </option>
                ))}
              </select>
            </FormField>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                I want to join as
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => handleRoleSelect("mentee")}
                  className={`p-4 border-2 rounded-lg text-center transition-all ${
                    selectedRole === "mentee"
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-500"
                  }`}
                >
                  <User className="w-6 h-6 mx-auto mb-2" />
                  <div className="font-medium">Mentee</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Seeking guidance
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleSelect("mentor")}
                  className={`p-4 border-2 rounded-lg text-center transition-all ${
                    selectedRole === "mentor"
                      ? "border-green-500 bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-500"
                  }`}
                >
                  <UserCheck className="w-6 h-6 mx-auto mb-2" />
                  <div className="font-medium">Mentor</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Sharing expertise
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleSelect("community_manager")}
                  className={`p-4 border-2 rounded-lg text-center transition-all ${
                    selectedRole === "community_manager"
                      ? "border-purple-500 bg-purple-50 dark:bg-purple-900 text-purple-700 dark:text-purple-300"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-500"
                  }`}
                >
                  <Shield className="w-6 h-6 mx-auto mb-2" />
                  <div className="font-medium">Community Manager</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Managing communities
                  </div>
                </button>
              </div>

              <input
                type="hidden"
                {...register("role", validationRules.role)}
                value={selectedRole}
              />

              {errors.role && (
                <div className="flex items-center space-x-1 text-red-600 dark:text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.role.message}</span>
                </div>
              )}
            </div>

            <FormField
              label="Password"
              name="password"
              type="password"
              placeholder="Create a strong password"
              register={register}
              error={errors.password}
              rules={validationRules.password}
              showPasswordToggle={true}
            />

            <PasswordStrengthIndicator password={watchPassword} />

            <button
              type="submit"
              disabled={isSubmitting || signupMutation.isPending}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting || signupMutation.isPending
                ? "Creating Account..."
                : "Create Account"}
            </button>

            {signupMutation.error && (
              <div className="rounded-md bg-red-50 dark:bg-red-900 p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <div className="ml-3">
                    <div className="text-sm text-red-700 dark:text-red-200">
                      {signupMutation.error.message}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  By signing up, you agree to our
                </span>
              </div>
            </div>
            <div className="mt-2 text-center">
              <Link
                to="/terms"
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Terms of Service
              </Link>
              <span className="text-gray-500 dark:text-gray-400"> and </span>
              <Link
                to="/privacy"
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
