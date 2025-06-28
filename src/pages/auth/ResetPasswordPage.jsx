import { useForm } from "react-hook-form"
import { useSearchParams, Link } from "react-router-dom"
import { AlertCircle } from "lucide-react"
import { useResetPassword } from "../../hooks/useAuth"
import { validationRules } from "../../data/authData"
import FormField from "../../features/Authenticaion/FormField"
import PasswordStrengthIndicator from "../../features/Authenticaion/PasswordStrengthIndicator"
import Logo from "../../ui/Logo"

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get("token")

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm()

  const resetPasswordMutation = useResetPassword()
  const watchPassword = watch("newPassword", "")
  const watchConfirmPassword = watch("confirmPassword", "")

  const onSubmit = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      return
    }

    try {
      await resetPasswordMutation.mutateAsync({
        token,
        newPassword: data.newPassword,
      })
    } catch (error) {
      console.error("Reset password failed:", error)
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Invalid Reset Link</h2>
            <p className="text-gray-600 mb-6">
              This password reset link is invalid or has expired. Please request a new one.
            </p>
            <Link
              to="/forgot-password"
              className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Request New Link
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Logo />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">Reset your password</h2>
        <p className="mt-2 text-center text-sm text-gray-600">Enter your new password below.</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* New Password Field */}
            <FormField
              label="New Password"
              name="newPassword"
              type="password"
              placeholder="Enter your new password"
              register={register}
              error={errors.newPassword}
              rules={validationRules.password}
              showPasswordToggle={true}
            />

            <PasswordStrengthIndicator password={watchPassword} />

            {/* Confirm Password Field */}
            <FormField
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your new password"
              register={register}
              error={errors.confirmPassword}
              rules={{
                required: "Please confirm your password",
                validate: (value) => value === watchPassword || "Passwords do not match",
              }}
              showPasswordToggle={true}
            />

            {/* Password Match Indicator */}
            {watchConfirmPassword && (
              <div className="text-sm">
                {watchPassword === watchConfirmPassword ? (
                  <span className="text-green-600">✓ Passwords match</span>
                ) : (
                  <span className="text-red-600">✗ Passwords do not match</span>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={
                isSubmitting ||
                resetPasswordMutation.isPending ||
                !watchPassword ||
                watchPassword !== watchConfirmPassword
              }
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting || resetPasswordMutation.isPending ? "Resetting..." : "Reset Password"}
            </button>

            {/* Error Message */}
            {resetPasswordMutation.error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">{resetPasswordMutation.error.message}</div>
              </div>
            )}
          </form>

          <div className="mt-6 text-center">
            <Link to="/login" className="text-sm text-blue-600 hover:text-blue-500">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
