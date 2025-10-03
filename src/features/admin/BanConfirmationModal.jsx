import { useState } from "react"
import { X, Ban, AlertTriangle, User } from "lucide-react"
import { useResolveUserReport } from "../../hooks/useUserReports"
import toast from "react-hot-toast"

export default function BanConfirmationModal({ report, onClose, onSuccess }) {
  // const resolveUserReport = useResolveUserReport()
  const [banReason, setBanReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const resolveUserReportMutation = useResolveUserReport()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!banReason.trim()) {
      setError("Ban reason is required")
      return
    }

    if (banReason.trim().length < 10) {
      setError("Ban reason must be at least 10 characters long")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      await resolveUserReportMutation.mutateAsync({
        reportId: report.id,
        action: "ban",
        banReason: banReason.trim(),
      })
      onSuccess()
      toast.success("User has been banned successfully");
    } catch (err) {
      setError(err.message || "Failed to ban user")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <Ban className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Ban User</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Warning */}
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-red-800 dark:text-red-200 mb-1">
                  Warning: This action cannot be undone
                </h3>
                <p className="text-sm text-red-700 dark:text-red-300">
                  Banning this user will immediately restrict their access to the platform and all its features.
                </p>
              </div>
            </div>
          </div>

          {/* Report Details */}
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-gray-900 dark:text-white mb-3">Report Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-300">Reported User:</span>
                <span className="font-medium text-gray-900 dark:text-white">{report.reportedUserId}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-300">Reporter:</span>
                <span className="font-medium text-gray-900 dark:text-white">{report.userId}</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-300">Violation:</span>
                <p className="font-medium text-gray-900 dark:text-white mt-1">{report.violation}</p>
              </div>
              {report.additionalDetails && (
                <div>
                  <span className="text-gray-600 dark:text-gray-300">
                    Additional Details:
                  </span>
                  <p className="font-medium text-gray-900 dark:text-white mt-1 break-words whitespace-pre-line">
                    {report.additionalDetails}
                  </p>
                </div>

              )}
            </div>
          </div>

          {/* Ban Reason Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="banReason" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ban Reason *
              </label>
              <textarea
                id="banReason"
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                placeholder="Provide a detailed reason for banning this user..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white resize-none"
                disabled={isSubmitting}
              />
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-gray-500 dark:text-gray-400">Minimum 10 characters required</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{banReason.length}/500</p>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                disabled={isSubmitting || !banReason.trim() || banReason.trim().length < 10}
              >
                {isSubmitting ? "Banning..." : "Ban User"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
