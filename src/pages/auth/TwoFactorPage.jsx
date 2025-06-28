import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Link } from "react-router-dom"
import { Shield, RefreshCw, ArrowLeft } from "lucide-react"
import { useVerify2FA, useResend2FA } from "../../hooks/useAuth"
import Logo from "../../ui/Logo"

export default function TwoFactorPage() {
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes
  const [canResend, setCanResend] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm()

  const verify2FAMutation = useVerify2FA()
  const resend2FAMutation = useResend2FA()

  const watchCode = watch("code", "")

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [timeLeft])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const onSubmit = async (data) => {
    try {
      await verify2FAMutation.mutateAsync(data.code)
    } catch (error) {
      console.error("2FA verification failed:", error)
    }
  }

  const handleResend = async () => {
    try {
      await resend2FAMutation.mutateAsync()
      setTimeLeft(300)
      setCanResend(false)
    } catch (error) {
      console.error("Resend failed:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Logo />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">Two-Factor Authentication</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          We've sent a 6-digit code to your email address. Enter it below to complete your login.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="flex justify-center mb-6">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 text-center mb-2">
                Enter 6-digit code
              </label>
              <input
                id="code"
                type="text"
                maxLength="6"
                placeholder="000000"
                className={`w-full px-3 py-3 border rounded-md shadow-sm text-center text-2xl font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.code ? "border-red-300" : "border-gray-300"
                  }`}
                {...register("code", {
                  required: "Verification code is required",
                  pattern: {
                    value: /^\d{6}$/,
                    message: "Code must be 6 digits",
                  },
                })}
                onChange={(e) => {
                  // Only allow numbers
                  e.target.value = e.target.value.replace(/\D/g, "")
                }}
              />
              {errors.code && <div className="mt-1 text-sm text-red-600 text-center">{errors.code.message}</div>}
            </div>

            {/* Timer */}
            <div className="text-center">
              {timeLeft > 0 ? (
                <p className="text-sm text-gray-500">Code expires in {formatTime(timeLeft)}</p>
              ) : (
                <p className="text-sm text-red-600">Code has expired</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || verify2FAMutation.isPending || watchCode.length !== 6}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting || verify2FAMutation.isPending ? "Verifying..." : "Verify Code"}
            </button>

            {/* Error Message */}
            {verify2FAMutation.error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700 text-center">{verify2FAMutation.error.message}</div>
              </div>
            )}
          </form>

          {/* Resend Code */}
          <div className="mt-6 text-center">
            {canResend ? (
              <button
                onClick={handleResend}
                disabled={resend2FAMutation.isPending}
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500 disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 mr-1 ${resend2FAMutation.isPending ? "animate-spin" : ""}`} />
                {resend2FAMutation.isPending ? "Sending..." : "Resend Code"}
              </button>
            ) : (
              <p className="text-sm text-gray-500">
                Didn't receive the code? <span className="text-gray-400">Wait {formatTime(timeLeft)} to resend</span>
              </p>
            )}
          </div>

          {/* Success Message for Resend */}
          {resend2FAMutation.isSuccess && (
            <div className="mt-4 rounded-md bg-green-50 p-4">
              <div className="text-sm text-green-700 text-center">New code sent to your email!</div>
            </div>
          )}

          {/* Error Message for Resend */}
          {resend2FAMutation.error && (
            <div className="mt-4 rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700 text-center">{resend2FAMutation.error.message}</div>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link to="/login" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-500">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
