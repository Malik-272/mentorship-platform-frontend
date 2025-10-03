"use client"

import { X, AlertTriangle } from "lucide-react"

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

export default function WithdrawConfirmationModal({ request, onConfirm, onCancel, isLoading }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      {/* Header - Fixed at top */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Withdraw Session Request</h2>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex items-start space-x-3 mb-4">
            <div className="flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Are you sure you want to withdraw this request?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                This action cannot be undone. You will need to create a new session request if you change your mind.
              </p>
            </div>
          </div>

          {/* Session Details */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Session Details:</h4>
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <div>
                <span className="font-medium">Mentor:</span> {request.mentorName}
              </div>
              <div>
                <span className="font-medium">Date & Time:</span> {formatDateTime(request.date, request.startTime)}
              </div>
              <div>
                <span className="font-medium">Agenda:</span> {request.agenda}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {isLoading ? "Withdrawing..." : "Withdraw Request"}
          </button>
        </div>
      </div>
    </div>
  )
}
