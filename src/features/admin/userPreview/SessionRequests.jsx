import { useState } from "react"
import { Calendar, Clock, CheckCircle, XCircle, AlertTriangle, Users } from "lucide-react"

export default function SessionRequests({ user }) {
  const [activeTab, setActiveTab] = useState("all")

  if (!user.sessionRequests) return null

  const allRequests = Object.entries(user.sessionRequests).flatMap(([status, requests]) =>
    requests.map((request) => ({ ...request, status })),
  )

  if (allRequests.length === 0) return null

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":")
    const date = new Date()
    date.setHours(Number.parseInt(hours), Number.parseInt(minutes))
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "PENDING":
        return <Clock className="h-4 w-4 text-orange-500" />
      case "ACCEPTED":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "REJECTED":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "CANCELLED":
        return <AlertTriangle className="h-4 w-4 text-gray-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      case "ACCEPTED":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "REJECTED":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "CANCELLED":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const tabs = [
    { id: "all", label: `All (${allRequests.length})`, requests: allRequests },
    {
      id: "PENDING",
      label: `Pending (${user.sessionRequests.PENDING?.length || 0})`,
      requests: user.sessionRequests.PENDING || [],
    },
    {
      id: "ACCEPTED",
      label: `Accepted (${user.sessionRequests.ACCEPTED?.length || 0})`,
      requests: user.sessionRequests.ACCEPTED || [],
    },
    {
      id: "REJECTED",
      label: `Rejected (${user.sessionRequests.REJECTED?.length || 0})`,
      requests: user.sessionRequests.REJECTED || [],
    },
    {
      id: "CANCELLED",
      label: `Cancelled (${user.sessionRequests.CANCELLED?.length || 0})`,
      requests: user.sessionRequests.CANCELLED || [],
    },
  ]

  const activeTabData = tabs.find((tab) => tab.id === activeTab)
  const displayRequests =
    activeTab === "all" ? allRequests : activeTabData.requests.map((req) => ({ ...req, status: activeTab }))

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Session Requests ({allRequests.length})
        </h3>
      </div>
      <div className="p-6">
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-1 mb-6 border-b border-gray-200 dark:border-gray-700">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${activeTab === tab.id
                ? "bg-blue-50 text-blue-700 border-b-2 border-blue-700 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-300"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-3">
          {displayRequests.map((request) => (
            <div key={request.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(request.status)}
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      request.status,
                    )}`}
                  >
                    {request.status}
                  </span>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">{formatDate(request.createdAt)}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <p>
                    <span className="font-medium">Date:</span> {new Date(request.date).toLocaleDateString()}
                  </p>
                  <p>
                    <span className="font-medium">Time:</span> {formatTime(request.startTime)}
                  </p>
                  <p>
                    <span className="font-medium">Duration:</span> {request.duration} minutes
                  </p>
                  <p>
                    <span className="font-medium">Service ID:</span> {request.serviceId}
                  </p>
                </div>
                <div className="space-y-1">
                  <p>
                    <span className="font-medium">Mentor:</span>{" "}
                    <a
                      href={`/management/users?id=${request.mentorId}`}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                    >
                      {request.mentorId}
                    </a>
                  </p>
                  {request.communityId && (
                    <p>
                      <span className="font-medium">Community:</span> {request.communityId}
                    </p>
                  )}
                  {request.rejectionReason && (
                    <p>
                      <span className="font-medium">Rejection Reason:</span> {request.rejectionReason}
                    </p>
                  )}
                </div>
              </div>
              {request.agenda && (
                <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm break-words whitespace-pre-line">
                    <span className="font-medium">Agenda:</span> {request.agenda}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}