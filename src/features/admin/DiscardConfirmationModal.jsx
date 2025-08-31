import { useState } from "react"
import { X, Trash2, User, Calendar } from "lucide-react"
import { useResolveUserReport } from "../../hooks/useUserReports"

export default function DiscardConfirmationModal({ report, onClose, onSuccess }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const resolveUserReportMutation = useResolveUserReport()

  const handleSubmit = async (e) => {
    e.preventDefault()

    setIsSubmitting(true)
    setError("")

    try {
      await resolveUserReportMutation.mutateAsync({
        reportId: report.id,
        action: "discard",
      })
      onSuccess()
    } catch (err) {
      setError(err.message || "Failed to discard report")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        < div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700" >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 dark:bg-gray-900/20 rounded-lg">
              <Trash2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Discard Report</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div >

        {/* Content */}
        < div className="p-6" >
          {/* Info */}
          < div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6" >
            <div className="flex items-start gap-3">
              <div className="p-1 bg-blue-100 dark:bg-blue-900/40 rounded">
                <Trash2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-1">
                  No action will be taken against the user
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  This report will be marked as resolved without any consequences for the reported user.
                </p>
              </div>
            </div>
          </div >

          {/* Report Details */}
          < div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 mb-6" >
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
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-300">Reported At:</span>
                <span className="font-medium text-gray-900 dark:text-white">{formatDate(report.reportedAt)}</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-300">Violation:</span>
                <p className="font-medium text-gray-900 dark:text-white mt-1">{report.violation}</p>
              </div>
              {report.additionalDetails && (
                // <div>
                //   <span className="text-gray-600 dark:text-gray-300">Additional Details:</span>
                //   <p className="font-medium text-gray-900 dark:text-white mt-1">{report.additionalDetails}</p>
                // </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-300">Additional Details:</span>
                  <p className="font-medium text-gray-900 dark:text-white mt-1 break-words whitespace-pre-line">
                    {report.additionalDetails}
                  </p>
                </div>

              )}
            </div>
          </div >

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )
          }

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
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Discarding..." : "Discard Report"}
            </button>
          </div>
        </div >
      </div >
    </div >
  )
}
