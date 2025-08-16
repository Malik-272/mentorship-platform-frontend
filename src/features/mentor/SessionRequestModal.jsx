import { X, User, Calendar, Clock, Users, MessageSquare, ExternalLink, Check, Ban } from "lucide-react"
import { formatDateTime } from "../../utils/formating"
// const formatDateTime = (date, time) => {
//   const dateObj = new Date(`${date}T${time}`)
//   return {
//     date: dateObj.toLocaleDateString("en-US", {
//       weekday: "long",
//       month: "long",
//       day: "numeric",
//       year: "numeric",
//     }),
//     time: dateObj.toLocaleTimeString("en-US", {
//       hour: "2-digit",
//       minute: "2-digit",
//       hour12: true,
//     }),
//   }
// }

const formatDuration = (minutes) => {
  if (minutes < 60) {
    return `${minutes} minutes`
  }
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  if (remainingMinutes === 0) {
    return `${hours} hour${hours > 1 ? "s" : ""}`
  }
  return `${hours} hour${hours > 1 ? "s" : ""} and ${remainingMinutes} minutes`
}

const canCancelSession = (date, startTime) => {
  const sessionDateTime = new Date(`${date}T${startTime}`)
  const now = new Date()
  const timeDiff = sessionDateTime.getTime() - now.getTime()
  const hoursUntilSession = timeDiff / (1000 * 60 * 60)
  return hoursUntilSession >= 6 // 6 hours minimum
}

export default function SessionRequestModal({ request, service, onClose, onAccept, onReject, onCancel, isLoading }) {
  const { date, time } = formatDateTime(request.date, request.startTime)
  const canCancel = onCancel && canCancelSession(request.date, request.startTime)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Session Request Details</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Mentee Information */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Mentee Information</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-500" />
                <span className="font-medium text-gray-900 dark:text-white">{request.menteeName}</span>
                <span className="text-sm text-gray-500">@{request.menteeId.slice(-8)}</span>
              </div>
              <a
                href={`/profile/${request.menteeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-blue-600 dark:text-blue-400 hover:underline text-sm"
              >
                <span>View Profile</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Session Details */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Session Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-2">
                <Calendar className="w-4 h-4 text-gray-500 mt-0.5" />
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Date & Time</div>
                  <div className="font-medium text-gray-900 dark:text-white">{date}</div>
                  <div className="font-medium text-gray-900 dark:text-white">{time}</div>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Clock className="w-4 h-4 text-gray-500 mt-0.5" />
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Duration</div>
                  <div className="font-medium text-gray-900 dark:text-white">{formatDuration(request.duration)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Agenda */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Session Agenda</h3>
            <div className="flex items-start space-x-2">
              <MessageSquare className="w-4 h-4 text-gray-500 mt-0.5" />
              <p className="text-gray-900 dark:text-white">{request.agenda}</p>
            </div>
          </div>

          {/* Community Information */}
          {request.communityId && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Community</h3>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-gray-500" />
                <span className="text-gray-900 dark:text-white">Requested through community</span>
                <span className="text-sm text-gray-500">#{request.communityId.slice(-8)}</span>
              </div>
            </div>
          )}

          {/* Request Information */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Request Information</h3>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Requested on{" "}
              {new Date(request.createdAt).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>

          {/* Rejection/Cancellation Reason */}
          {request.rejectionReason && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <h3 className="text-lg font-medium text-red-900 dark:text-red-100 mb-2">Rejection Reason</h3>
              <p className="text-red-800 dark:text-red-200">{request.rejectionReason}</p>
            </div>
          )}

          {request.cancellationReason && (
            <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Cancellation Reason</h3>
              <p className="text-gray-800 dark:text-gray-200">{request.cancellationReason}</p>
            </div>
          )}

          {/* Google Calendar Link (for accepted sessions) */}
          {request.calendarEventId && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h3 className="text-lg font-medium text-blue-900 dark:text-blue-100 mb-2">Calendar Event</h3>
              <a
                href={`https://calendar.google.com/calendar/event?eid=${request.calendarEventId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:underline"
              >
                <span>View in Google Calendar</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>

        {/* Actions */}
        {(onAccept || onReject || onCancel) && (
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
            {onAccept && (
              <button
                onClick={() => {
                  onClose()
                  onAccept(request)
                }}
                disabled={isLoading}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                <span>Accept Request</span>
              </button>
            )}

            {onReject && (
              <button
                onClick={() => {
                  onClose()
                  onReject(request)
                }}
                disabled={isLoading}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                <X className="w-4 h-4" />
                <span>Reject Request</span>
              </button>
            )}

            {onCancel && (
              <button
                onClick={() => {
                  onClose()
                  onCancel(request)
                }}
                disabled={isLoading || !canCancel}
                className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${canCancel
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  }`}
                title={canCancel ? "Cancel Session" : "Cannot cancel (less than 6 hours remaining)"}
              >
                <Ban className="w-4 h-4" />
                <span>Cancel Session</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
