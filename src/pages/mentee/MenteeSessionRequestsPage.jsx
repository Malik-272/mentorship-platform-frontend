import { useState } from "react"
import { Link } from "react-router-dom"
import { Calendar, Clock, User, MessageSquare, X, AlertTriangle, Users, Eye, Edit, Trash2 } from "lucide-react"
import {
  useGetMenteeSessionRequests,
  useWithdrawSessionRequest,
  useUpdateSessionRequestAgenda,
} from "../../hooks/useMenteeSessionRequests.js"
import LoadingSpinner from "../../ui/LoadingSpinner"
import ErrorMessage from "../../ui/ErrorMessage"
import MenteeSessionRequestModal from "../../features/mentee/MenteeSessionRequestModal"
import WithdrawConfirmationModal from "../../features/mentee/WithdrawConfirmationModal"
import UpdateAgendaModal from "../../features/mentee/UpdateAgendaModal"
import toast from "react-hot-toast"

const STATUS_CONFIG = {
  PENDING: {
    title: "Pending Requests",
    color: "orange",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
    borderColor: "border-orange-200 dark:border-orange-800",
    textColor: "text-orange-700 dark:text-orange-300",
    icon: Clock,
  },
  ACCEPTED: {
    title: "Accepted Sessions",
    color: "green",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    borderColor: "border-green-200 dark:border-green-800",
    textColor: "text-green-700 dark:text-green-300",
    icon: Calendar,
  },
  REJECTED: {
    title: "Rejected Requests",
    color: "red",
    bgColor: "bg-red-50 dark:bg-red-900/20",
    borderColor: "border-red-200 dark:border-red-800",
    textColor: "text-red-700 dark:text-red-300",
    icon: X,
  },
  CANCELLED: {
    title: "Canceled Sessions",
    color: "gray",
    bgColor: "bg-gray-50 dark:bg-gray-900/20",
    borderColor: "border-gray-200 dark:border-gray-800",
    textColor: "text-gray-700 dark:text-gray-300",
    icon: AlertTriangle,
  },
}

const formatDateTime = (date, time) => {
  const dateObj = new Date(`${date}T${time}`)
  return {
    date: dateObj.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    time: dateObj.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),
  }
}

const formatDuration = (minutes) => {
  if (minutes < 60) {
    return `${minutes}min`
  }
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  if (remainingMinutes === 0) {
    return `${hours}h`
  }
  return `${hours}h ${remainingMinutes}min`
}

const formatServiceType = (serviceType) => {
  return serviceType.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
}

const SessionRequestItem = ({ request, status, onViewDetails, onWithdraw, onUpdateAgenda, isLoading }) => {
  const config = STATUS_CONFIG[status]
  const { date, time } = formatDateTime(request.date, request.startTime)

  return (
    <div className={`p-4 rounded-lg border ${config.borderColor} ${config.bgColor} hover:shadow-sm transition-shadow`}>
      <div className="flex items-start justify-between">
        <div className="flex-1 cursor-pointer" onClick={() => onViewDetails(request)}>
          <div className="flex items-center space-x-3 mb-2">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {formatServiceType(request.serviceType)}
              </span>
              <span className="text-xs text-gray-500">•</span>
              <User className="w-4 h-4 text-gray-500" />
              <Link
                to={`/profile/${request.mentorId}`}
                className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                {request.mentorName}
              </Link>
              <span className="text-xs text-gray-500">@{request.mentorId.slice(-8)}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>
                {date} at {time}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{formatDuration(request.duration)}</span>
            </div>
            {request.communityId && (
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>Via Community</span>
              </div>
            )}
            <div className="flex items-center space-x-1">
              <MessageSquare className="w-4 h-4" />
              <span className="truncate">{request.agenda}</span>
            </div>
          </div>

          <div className="text-xs text-gray-500">Requested {new Date(request.createdAt).toLocaleDateString()}</div>

          {status === "REJECTED" && request.rejectionReason && (
            <div className="mt-2 text-xs text-red-600 dark:text-red-400">Reason: {request.rejectionReason}</div>
          )}

          {status === "CANCELLED" && request.cancellationReason && (
            <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">Reason: {request.cancellationReason}</div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 ml-4">
          {status === "PENDING" && (
            <>
              <button
                onClick={() => onUpdateAgenda(request)}
                disabled={isLoading}
                className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg transition-colors disabled:opacity-50"
                title="Update Agenda"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => onWithdraw(request)}
                disabled={isLoading}
                className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                title="Withdraw Request"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}

          <button
            onClick={() => onViewDetails(request)}
            className="p-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

const SessionRequestsList = ({ requests, status, onViewDetails, onWithdraw, onUpdateAgenda, isLoading }) => {
  const config = STATUS_CONFIG[status]
  const Icon = config.icon

  if (!requests || requests.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
        <div className={`w-12 h-12 mx-auto mb-4 ${config.bgColor} rounded-full flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${config.textColor}`} />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No {status.toLowerCase()} requests</h3>
        <p className="text-gray-600 dark:text-gray-400">
          {status === "PENDING" && "You don't have any pending session requests at the moment."}
          {status === "ACCEPTED" && "You don't have any accepted session requests yet."}
          {status === "REJECTED" && "You don't have any rejected session requests."}
          {status === "CANCELLED" && "No sessions have been canceled."}
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className={`px-6 py-4 border-b border-gray-200 dark:border-gray-700 ${config.bgColor}`}>
        <div className="flex items-center space-x-3">
          <Icon className={`w-5 h-5 ${config.textColor}`} />
          <h2 className={`text-lg font-semibold ${config.textColor}`}>{config.title}</h2>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.bgColor} ${config.textColor}`}>
            {requests.length}
          </span>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {requests.map((request) => (
          <SessionRequestItem
            key={request.id}
            request={request}
            status={status}
            onViewDetails={onViewDetails}
            onWithdraw={onWithdraw}
            onUpdateAgenda={onUpdateAgenda}
            isLoading={isLoading}
          />
        ))}
      </div>
    </div>
  )
}

export default function MenteeSessionRequestsPage() {
  // State for modals
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)
  const [showUpdateAgendaModal, setShowUpdateAgendaModal] = useState(false)

  // API hooks
  const {
    data: sessionRequests,
    isLoading: requestsLoading,
    error: requestsError,
    refetch: refetchRequests,
  } = useGetMenteeSessionRequests()

  const withdrawMutation = useWithdrawSessionRequest()
  const updateAgendaMutation = useUpdateSessionRequestAgenda()

  // Authentication and authorization checks
  if (requestsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (requestsError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorMessage message="Failed to load session requests" onRetry={refetchRequests} />
      </div>
    )
  }

  // Handle actions
  const handleViewDetails = (request) => {
    setSelectedRequest(request)
    setShowDetailsModal(true)
  }

  const handleWithdraw = (request) => {
    setSelectedRequest(request)
    setShowWithdrawModal(true)
  }

  const handleUpdateAgenda = (request) => {
    setSelectedRequest(request)
    setShowUpdateAgendaModal(true)
  }

  const handleWithdrawConfirm = async () => {
    try {
      await withdrawMutation.mutateAsync(selectedRequest.id)
      setShowWithdrawModal(false)
      setSelectedRequest(null)
      toast.success('Session request has been withdrawn successfully')
    } catch (error) {
      console.error("Failed to withdraw request:", error)
      toast.error("Failed to withdraw request: ", error.message)
    }
  }

  const handleUpdateAgendaConfirm = async (newAgenda) => {
    try {
      await updateAgendaMutation.mutateAsync({
        requestId: selectedRequest.id,
        agenda: newAgenda,
      })
      setShowUpdateAgendaModal(false)
      setSelectedRequest(null)
      toast.success('Session agenda has been updated successfully')
    } catch (error) {
      console.error("Failed to update agenda:", error)
      toast.error('Failed to updated agenda:', error.message)
    }
  }

  const isLoading = withdrawMutation.isPending || updateAgendaMutation.isPending

  const totalRequests = Object.values(sessionRequests?.sessionRequests || {}).reduce(
    (sum, requests) => sum + requests.length,
    0,
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">My Session Requests</h1>
              <p className="text-gray-600 dark:text-gray-400">View and manage all your mentoring session requests</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{totalRequests}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Requests</div>
            </div>
          </div>
        </div>

        {/* Session Requests Lists */}
        <div className="space-y-8">
          {Object.entries(STATUS_CONFIG).map(([status]) => (
            <SessionRequestsList
              key={status}
              requests={sessionRequests?.sessionRequests?.[status] || []}
              status={status}
              onViewDetails={handleViewDetails}
              onWithdraw={handleWithdraw}
              onUpdateAgenda={handleUpdateAgenda}
              isLoading={isLoading}
            />
          ))}
        </div>

        {/* Modals */}
        {showDetailsModal && selectedRequest && (
          <MenteeSessionRequestModal
            request={selectedRequest}
            onClose={() => {
              setShowDetailsModal(false)
              setSelectedRequest(null)
            }}
            onWithdraw={sessionRequests?.sessionRequests?.PENDING?.includes(selectedRequest) ? handleWithdraw : null}
            onUpdateAgenda={
              sessionRequests?.sessionRequests?.PENDING?.includes(selectedRequest) ? handleUpdateAgenda : null
            }
            isLoading={isLoading}
          />
        )}

        {showWithdrawModal && selectedRequest && (
          <WithdrawConfirmationModal
            request={selectedRequest}
            onConfirm={handleWithdrawConfirm}
            onCancel={() => {
              setShowWithdrawModal(false)
              setSelectedRequest(null)
            }}
            isLoading={withdrawMutation.isPending}
          />
        )}

        {showUpdateAgendaModal && selectedRequest && (
          <UpdateAgendaModal
            request={selectedRequest}
            onConfirm={handleUpdateAgendaConfirm}
            onCancel={() => {
              setShowUpdateAgendaModal(false)
              setSelectedRequest(null)
            }}
            isLoading={updateAgendaMutation.isPending}
          />
        )}
      </div>
    </div>
  )
}
