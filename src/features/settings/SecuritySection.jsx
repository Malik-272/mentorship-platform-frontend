import { useState } from "react"
import { useForm } from "react-hook-form"
import { Eye, EyeOff, Shield, Key } from "lucide-react"
import { useChangePassword, useToggle2FA } from "../../hooks/useSettings"
import { validationRules } from "../../data/authData"
import PasswordStrengthIndicator from "../Authenticaion/PasswordStrengthIndicator"

export default function SecuritySection({ user }) {
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm()

  const changePasswordMutation = useChangePassword()
  const toggle2FAMutation = useToggle2FA()

  const watchNewPassword = watch("newPassword", "")
  const watchConfirmPassword = watch("confirmPassword", "")

  const onSubmitPassword = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      return
    }

    try {
      await changePasswordMutation.mutateAsync({
        password: data.newPassword,
      })
      reset() // Clear form after successful change
    } catch (error) {
      console.error("Password change failed:", error)
    }
  }

  const handleToggle2FA = async () => {
    try {
      await toggle2FAMutation.mutateAsync(!user.is_2fa_enabled)
    } catch (error) {
      console.error("2FA toggle failed:", error)
    }
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Security Settings</h2>
        <p className="text-gray-600 dark:text-gray-300">Manage your password and two-factor authentication settings.</p>
      </div>

      <div className="space-y-8">
        {/* Change Password Section */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
          <div className="flex items-center mb-6">
            <Key className="w-5 h-5 text-gray-400 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Change Password</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Update your password to keep your account secure
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmitPassword)} className="space-y-4">
            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">New Password</label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  {...register("newPassword", validationRules.password)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter your new password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-400" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.newPassword && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.newPassword.message}</p>
              )}
              <PasswordStrengthIndicator password={watchNewPassword} />
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirmPassword", {
                    required: "Please confirm your new password",
                    validate: (value) => value === watchNewPassword || "Passwords do not match",
                  })}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Confirm your new password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-400" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword.message}</p>
              )}

              {/* Password Match Indicator */}
              {watchConfirmPassword && (
                <div className="mt-2 text-sm">
                  {watchNewPassword === watchConfirmPassword ? (
                    <span className="text-green-600 dark:text-green-400">✓ Passwords match</span>
                  ) : (
                    <span className="text-red-600 dark:text-red-400">✗ Passwords do not match</span>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={
                  changePasswordMutation.isPending || !watchNewPassword || watchNewPassword !== watchConfirmPassword
                }
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-md transition-colors disabled:cursor-not-allowed"
              >
                {changePasswordMutation.isPending ? "Changing..." : "Change Password"}
              </button>
            </div>

            {/* Success/Error Messages */}
            {changePasswordMutation.isSuccess && (
              <div className="rounded-md bg-green-50 dark:bg-green-900/20 p-4">
                <div className="text-sm text-green-700 dark:text-green-400">Password changed successfully!</div>
              </div>
            )}

            {changePasswordMutation.error && (
              <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
                <div className="text-sm text-red-700 dark:text-red-400">{changePasswordMutation.error.message}</div>
              </div>
            )}
          </form>
        </div>

        {/* Two-Factor Authentication Section */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Shield className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Add an extra layer of security to your account
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <button
                onClick={handleToggle2FA}
                disabled={true}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${user?.is_2fa_enabled ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-600"
                  }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${user?.is_2fa_enabled ? "translate-x-6" : "translate-x-1"
                    }`}
                />
              </button>
              <span className="ml-3 text-sm font-medium text-gray-900 dark:text-white">
                {user?.is_2fa_enabled ? "Enabled" : "Disabled"}
              </span>
            </div>
          </div>

          <div className="mt-4">
            <div
              className={`p-4 rounded-md ${user?.is_2fa_enabled
                ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                : "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800"
                }`}
            >
              <p
                className={`text-sm ${user?.is_2fa_enabled ? "text-green-700 dark:text-green-400" : "text-yellow-700 dark:text-yellow-400"
                  }`}
              >
                {"Two-factor authentication will be implemented soon."}
              </p>
            </div>
          </div>

          {/* Loading/Error States */}
          {toggle2FAMutation.isPending && (
            <div className="mt-4 text-sm text-blue-600 dark:text-blue-400">
              {user?.is_2fa_enabled ? "Disabling..." : "Enabling..."} two-factor authentication...
            </div>
          )}

          {toggle2FAMutation.error && (
            <div className="mt-4 rounded-md bg-red-50 dark:bg-red-900/20 p-4">
              <div className="text-sm text-red-700 dark:text-red-400">{toggle2FAMutation.error.message}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
