import { useState } from "react"
import { Link, useParams } from "react-router-dom"
import { Calendar, Clock, User, MessageSquare, Check, X, AlertTriangle, Users, ArrowLeft, Eye, Ban } from "lucide-react"
import {
  useGetServiceSessionRequests,
  useAcceptSessionRequest,
  useRejectSessionRequest,
  useCancelSessionRequest,
} from "../../hooks/useSessionRequests"
import { useGetMyService as useGetMentorService } from "../../hooks/useServices"
import LoadingSpinner from "../../ui/LoadingSpinner"
import ErrorMessage from "../../ui/ErrorMessage"
import SessionRequestModal from "../../features/mentor/SessionRequestModal"
import AcceptConfirmationModal from "../../features/mentor/AcceptConfirmationModal"
import RejectReasonModal from "../../features/mentor/RejectReasonModal"
import CancelConfirmationModal from "../../features/mentor/CancelConfirmationModal"
import { STATUS_CONFIG } from "../../data/MentorData"
import { formatDateTime, formatDuration } from "../../utils/formating"
import toast from "react-hot-toast"

const canCancelSession = (date, startTime) => {
  const sessionDateTime = new Date(`${date}T${startTime}`)
  const now = new Date()
  const timeDiff = sessionDateTime.getTime() - now.getTime()
  const hoursUntilSession = timeDiff / (1000 * 60 * 60)
  return hoursUntilSession >= 6 // 6 hours minimum
}

const SessionRequestItem = ({ request, status, onViewDetails, onAccept, onReject, onCancel, isLoading }) => {
  const config = STATUS_CONFIG[status]
  const { date, time } = formatDateTime(request.date, request.startTime)
  const canCancel = status === "ACCEPTED" && canCancelSession(request.date, request.startTime)

  return (
    <div className={`p-4 rounded-lg border ${config.borderColor} ${config.bgColor} hover:shadow-sm transition-shadow`}>
      <div className="flex items-start justify-between">
        <div className="flex-1 cursor-pointer" onClick={() => onViewDetails(request)}>
          <div className="flex items-center space-x-3 mb-2">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-gray-500" />
              <Link
                to={`/profile/${request.menteeId}`}
                className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                {request.menteeName}
              </Link>
              <span className="text-xs text-gray-500">@{request.menteeId.slice(-8)}</span>
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
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 ml-4">
          {status === "PENDING" && (
            <>
              <button
                onClick={() => onAccept(request)}
                disabled={isLoading}
                className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20 rounded-lg transition-colors disabled:opacity-50"
                title="Accept Request"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={() => onReject(request)}
                disabled={isLoading}
                className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                title="Reject Request"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          )}

          {status === "ACCEPTED" && (
            <button
              onClick={() => onCancel(request)}
              disabled={isLoading || !canCancel}
              className={`p-2 rounded-lg transition-colors ${canCancel
                ? "text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20"
                : "text-gray-400 cursor-not-allowed"
                }`}
              title={canCancel ? "Cancel Session" : "Cannot cancel (less than 6 hours remaining)"}
            >
              <Ban className="w-4 h-4" />
            </button>
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

const SessionRequestsList = ({ requests, status, onViewDetails, onAccept, onReject, onCancel, isLoading }) => {
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
          {status === "ACCEPTED" && "You haven't accepted any session requests yet."}
          {status === "REJECTED" && "You haven't rejected any session requests."}
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
            onAccept={onAccept}
            onReject={onReject}
            onCancel={onCancel}
            isLoading={isLoading}
          />
        ))}
      </div>
    </div>
  )
}

export default function SessionRequestsPage() {
  const { id: serviceId } = useParams()
  // const { user, isAuthenticated, isLoading: authLoading } = useAuth()

  // State for modals
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showAcceptModal, setShowAcceptModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)

  // API hooks
  const { data: service, isLoading: serviceLoading, error: serviceError } = useGetMentorService(serviceId)

  const {
    data: sessionRequests,
    isLoading: requestsLoading,
    error: requestsError,
    refetch: refetchRequests,
  } = useGetServiceSessionRequests(serviceId)

  const acceptMutation = useAcceptSessionRequest()
  const rejectMutation = useRejectSessionRequest()
  const cancelMutation = useCancelSessionRequest()

  // Authentication and authorization checks
  if (serviceLoading || requestsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (serviceError || !service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Service Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The service you're looking for doesn't exist or you don't have access to it.
          </p>
          <Link
            to="/my/services"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to My Services</span>
          </Link>
        </div>
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

  const handleAccept = (request) => {
    setSelectedRequest(request)
    setShowAcceptModal(true)
  }

  const handleReject = (request) => {
    setSelectedRequest(request)
    setShowRejectModal(true)
  }

  const handleCancel = (request) => {
    setSelectedRequest(request)
    setShowCancelModal(true)
  }

  const handleAcceptConfirm = async () => {
    try {
      await acceptMutation.mutateAsync({
        serviceId,
        requestId: selectedRequest.id,
        agenda: selectedRequest.agenda,
      })
      setShowAcceptModal(false)
      setSelectedRequest(null)
      toast.success("Session accepted successfully, check the invitation we sent to your calendar")
    } catch (error) {
      console.error("Failed to accept request:", error)
      toast.error("Failed to accept session request")
    }
  }

  const handleRejectConfirm = async (reason) => {
    try {
      await rejectMutation.mutateAsync({
        serviceId,
        requestId: selectedRequest.id,
        rejectionReason: reason,
      })
      setShowRejectModal(false)
      setSelectedRequest(null)
      toast.success("Request rejected successfully")
    } catch (error) {
      console.error("Failed to reject request:", error)
      toast.error("Failed to reject request")
    }
  }

  const handleCancelConfirm = async (reason) => {
    try {
      await cancelMutation.mutateAsync({
        serviceId,
        requestId: selectedRequest.id,
        rejectionReason: reason,
      })
      setShowCancelModal(false)
      setSelectedRequest(null)
      toast.success("Session cancelled successfully")
    } catch (error) {
      console.error("Failed to cancel session:", error)
      toast.error("Failed to cancel session")
    }
  }

  const isLoading = acceptMutation.isPending || rejectMutation.isPending || cancelMutation.isPending

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
              <div className="flex items-center space-x-3 mb-2">
                <Link
                  to="/my/services"
                  className="p-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Link>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Session Requests</h1>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Manage session requests for your {service.type.replace("_", " ").toLowerCase()} service
              </p>
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
              onAccept={handleAccept}
              onReject={handleReject}
              onCancel={handleCancel}
              isLoading={isLoading}
            />
          ))}
        </div>

        {/* Modals */}
        {showDetailsModal && selectedRequest && (
          <SessionRequestModal
            request={selectedRequest}
            service={service}
            onClose={() => {
              setShowDetailsModal(false)
              setSelectedRequest(null)
            }}
            onAccept={sessionRequests?.sessionRequests?.PENDING?.includes(selectedRequest) ? handleAccept : null}
            onReject={sessionRequests?.sessionRequests?.PENDING?.includes(selectedRequest) ? handleReject : null}
            onCancel={sessionRequests?.sessionRequests?.ACCEPTED?.includes(selectedRequest) ? handleCancel : null}
            isLoading={isLoading}
          />
        )}

        {showAcceptModal && selectedRequest && (
          <AcceptConfirmationModal
            request={selectedRequest}
            onConfirm={handleAcceptConfirm}
            onCancel={() => {
              setShowAcceptModal(false)
              setSelectedRequest(null)
            }}
            isLoading={acceptMutation.isPending}
          />
        )}

        {showRejectModal && selectedRequest && (
          <RejectReasonModal
            request={selectedRequest}
            onConfirm={handleRejectConfirm}
            onCancel={() => {
              setShowRejectModal(false)
              setSelectedRequest(null)
            }}
            isLoading={rejectMutation.isPending}
          />
        )}

        {showCancelModal && selectedRequest && (
          <CancelConfirmationModal
            request={selectedRequest}
            onConfirm={handleCancelConfirm}
            onCancel={() => {
              setShowCancelModal(false)
              setSelectedRequest(null)
            }}
            isLoading={cancelMutation.isPending}
          />
        )}
      </div>
    </div>
  )
}
