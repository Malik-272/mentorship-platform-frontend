import { useState } from "react"
import { Ban, User, Calendar } from "lucide-react"

const formatDateTime = (date, time) => {
  const dateObj = new Date(`${date}T${time}`)
  return dateObj.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
}

const COMMON_REASONS = [
  "Personal emergency",
  "Schedule conflict",
  "Technical issues",
  "Health reasons",
  "Family emergency",
  "Other",
]

export default function CancelConfirmationModal({ request, onConfirm, onCancel, isLoading }) {
  const [selectedReason, setSelectedReason] = useState("")
  const [customReason, setCustomReason] = useState("")
  const [isCustom, setIsCustom] = useState(false)

  const handleReasonSelect = (reason) => {
    if (reason === "Other") {
      setIsCustom(true)
      setSelectedReason("")
    } else {
      setIsCustom(false)
      setSelectedReason(reason)
      setCustomReason("")
    }
  }

  const handleSubmit = () => {
    const finalReason = isCustom ? customReason.trim() : selectedReason
    onConfirm(finalReason || undefined)
  }

  const canSubmit = isCustom ? customReason.trim().length > 0 : selectedReason.length > 0

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
              <Ban className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Cancel Session</h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <p className="text-gray-600 dark:text-gray-400 mb-4">You're about to cancel a scheduled session with:</p>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-500" />
                <span className="font-medium text-gray-900 dark:text-white">{request.menteeName}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-gray-900 dark:text-white">{formatDateTime(request.date, request.startTime)}</span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Reason for cancellation (optional)
            </label>

            <div className="space-y-2">
              {COMMON_REASONS.map((reason) => (
                <label key={reason} className="flex items-center">
                  <input
                    type="radio"
                    name="reason"
                    value={reason}
                    checked={reason === "Other" ? isCustom : selectedReason === reason}
                    onChange={() => handleReasonSelect(reason)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-900 dark:text-white">{reason}</span>
                </label>
              ))}
            </div>

            {isCustom && (
              <div className="mt-3">
                <textarea
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="Please specify your reason..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white resize-none"
                  rows={3}
                  maxLength={200}
                />
                <div className="text-xs text-gray-500 mt-1">{customReason.length}/200 characters</div>
              </div>
            )}
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <p className="text-red-800 dark:text-red-200 text-sm">
              <strong>Warning:</strong> Canceling this session will notify the mentee immediately. The calendar event
              will be removed and both parties will receive cancellation notifications.
            </p>
          </div>

          <div className="flex items-center justify-end space-x-3">
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              Keep Session
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Canceling...</span>
                </>
              ) : (
                <>
                  <Ban className="w-4 h-4" />
                  <span>Cancel Session</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
