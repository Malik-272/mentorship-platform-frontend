import { useState } from "react"
import { useForm } from "react-hook-form"
import { Link } from "react-router-dom"
import { User, UserCheck, AlertCircle } from "lucide-react"
import { useSignup } from "../../hooks/useAuth"
import { validationRules, countryCodes } from "../../data/authData"
import FormField from "../../features/Authenticaion/FormField"
import PasswordStrengthIndicator from "../../features/Authenticaion/PasswordStrengthIndicator"
import Logo from "../../ui/Logo"


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
  })

  const signupMutation = useSignup()
  const watchPassword = watch("password", "")

  // Handle role selection
  const handleRoleSelect = (role) => {
    setSelectedRole(role)
    setValue("role", role, { shouldValidate: true })
  }

  const onSubmit = async (data) => {
    try {
      console.log("Submitting signup data:", data)
      await signupMutation.mutateAsync(data)
    } catch (error) {
      console.error("Signup failed:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Logo />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">Create your account</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Name Field */}
            <FormField
              label="Full Name"
              name="name"
              placeholder="Enter your full name"
              register={register}
              error={errors.name}
              rules={validationRules.name}
            />

            {/* Username Field */}
            <FormField
              label="Username"
              name="id"
              placeholder="Choose a username"
              register={register}
              error={errors.id}
              rules={validationRules.id}
            />

            {/* Email Field */}
            <FormField
              label="Email Address"
              name="email"
              type="email"
              placeholder="Enter your email"
              register={register}
              error={errors.email}
              rules={validationRules.email}
            />

            {/* Headline Field */}
            <FormField
              label="Professional Headline"
              name="headline"
              placeholder="e.g., Software Engineer at Google"
              register={register}
              error={errors.headline}
              rules={validationRules.headline}
            />

            {/* Country Field */}
            <FormField
              label="Country"
              name="country"
              register={register}
              error={errors.country}
              rules={validationRules.country}
            >
              <select
                {...register("country", validationRules.country)}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.country ? "border-red-300" : "border-gray-300"
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

            {/* Role Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">I want to join as</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleRoleSelect("mentee")}
                  className={`p-4 border-2 rounded-lg text-center transition-all ${selectedRole === "mentee"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 hover:border-gray-300"
                    }`}
                >
                  <User className="w-6 h-6 mx-auto mb-2" />
                  <div className="font-medium">Mentee</div>
                  <div className="text-xs text-gray-500">Seeking guidance</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleSelect("mentor")}
                  className={`p-4 border-2 rounded-lg text-center transition-all ${selectedRole === "mentor"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 hover:border-gray-300"
                    }`}
                >
                  <UserCheck className="w-6 h-6 mx-auto mb-2" />
                  <div className="font-medium">Mentor</div>
                  <div className="text-xs text-gray-500">Sharing expertise</div>
                </button>
              </div>

              {/* Hidden input for role */}
              <input type="hidden" {...register("role", validationRules.role)} value={selectedRole} />

              {errors.role && (
                <div className="flex items-center space-x-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.role.message}</span>
                </div>
              )}
            </div>

            {/* Password Field */}
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || signupMutation.isPending}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting || signupMutation.isPending ? "Creating Account..." : "Create Account"}
            </button>

            {/* Error Message */}
            {signupMutation.error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <div className="ml-3">
                    <div className="text-sm text-red-700">{signupMutation.error.message}</div>
                  </div>
                </div>
              </div>
            )}
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">By signing up, you agree to our</span>
              </div>
            </div>
            <div className="mt-2 text-center">
              <Link to="/terms" className="text-sm text-blue-600 hover:text-blue-500">
                Terms of Service
              </Link>
              <span className="text-gray-500"> and </span>
              <Link to="/privacy" className="text-sm text-blue-600 hover:text-blue-500">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
