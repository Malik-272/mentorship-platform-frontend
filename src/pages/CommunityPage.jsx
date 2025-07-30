import { useState } from "react"
import { useParams, Link, data } from "react-router-dom"
import { Users, Shield, ShieldCheck, Settings, UserPlus, UserMinus, Crown, MapPin, ExternalLink } from "lucide-react"
import { useAuth } from "../context/AuthContext"
import { useGetCommunity, useJoinCommunity, useLeaveCommunity, useRequestToJoin } from "../hooks/useCommunity"
// import ProtectedRoute from "../ui/ProtectedRoute"
import MembersModal from "../features/community/MembersModal"
import VerificationHelpModal from "../features/community/VerificationHelpModal"
import LoadingSpinner from "../ui/LoadingSpinner"
import ErrorMessage from "../ui/ErrorMessage"

export default function CommunityPage() {
  const { id } = useParams()
  const { user: currentUser } = useAuth()
  const [showMembersModal, setShowMembersModal] = useState(false)
  const [showVerificationModal, setShowVerificationModal] = useState(false)
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false)

  const { data: communityData, isLoading, error } = useGetCommunity(id)
  const joinCommunityMutation = useJoinCommunity()
  const leaveCommunityMutation = useLeaveCommunity()
  const requestToJoinMutation = useRequestToJoin()

  console.log("community:", communityData);
  if (isLoading) {
    return (
      // <ProtectedRoute requireAuth={true} requireVerification={true}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading community..." />
      </div>
      // </ProtectedRoute>
    )
  }

  if (error) {
    return (
      // <ProtectedRoute requireAuth={true} requireVerification={true}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <ErrorMessage
          title="Community Not Found"
          message={error.message || "The community you're looking for doesn't exist or has been removed."}
          showRetry={true}
          onRetry={() => window.location.reload()}
        />
      </div>
      // </ProtectedRoute>
    )
  }

  const community = communityData?.community
  const userMembership = communityData?.userMembership
  const isManager = currentUser?.role === "community_manager" && community?.managerId === currentUser?.id
  const isAdmin = currentUser?.role === "admin"
  const isMember = !!userMembership
  const canViewMembers = isMember || isManager || isAdmin
  const canRequestJoin =
    (currentUser?.role === "mentee" || currentUser?.role === "mentor") && !isMember && !userMembership?.status // No pending request

  const handleJoinRequest = async () => {
    try {
      await requestToJoinMutation.mutateAsync(community.id)
    } catch (error) {
      console.error("Join request failed:", error)
    }
  }

  const handleLeave = async () => {
    try {
      await leaveCommunityMutation.mutateAsync(community.id)
      setShowLeaveConfirm(false)
    } catch (error) {
      console.error("Leave community failed:", error)
    }
  }

  return (
    // <ProtectedRoute requireAuth={true} requireVerification={true}>
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CommunityHeader
          community={community}
          isManager={isManager}
          isAdmin={isAdmin}
          onShowVerification={() => setShowVerificationModal(true)}
        />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CommunityInfo community={community} />
          </div>
          <div className="lg:col-span-1">
            <CommunitySidebar
              community={community}
              userMembership={userMembership}
              canViewMembers={canViewMembers}
              canRequestJoin={canRequestJoin}
              isMember={isMember}
              isManager={isManager}
              isAdmin={isAdmin}
              showLeaveConfirm={showLeaveConfirm}
              onShowMembers={() => setShowMembersModal(true)}
              onJoinRequest={handleJoinRequest}
              onShowLeaveConfirm={() => setShowLeaveConfirm(true)}
              onCancelLeave={() => setShowLeaveConfirm(false)}
              onConfirmLeave={handleLeave}
              requestToJoinMutation={requestToJoinMutation}
              leaveCommunityMutation={leaveCommunityMutation}
            />
          </div>
        </div>
      </div>

      {/* Members Modal */}
      {showMembersModal && canViewMembers && (
        <MembersModal
          isOpen={showMembersModal}
          onClose={() => setShowMembersModal(false)}
          communityId={community.id}
          communityName={community.name}
        />
      )}

      {/* Verification Help Modal */}
      {showVerificationModal && (
        <VerificationHelpModal isOpen={showVerificationModal} onClose={() => setShowVerificationModal(false)} />
      )}
    </div>
    // </ProtectedRoute>
  )
}

// Community Header Component
function CommunityHeader({ community, isManager, isAdmin, onShowVerification }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Cover Image */}
      <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative">
        {community?.cover_image && (
          <img
            src={community.cover_image || "/placeholder.svg"}
            alt={`${community.name} cover`}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      </div>

      <div className="px-6 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-6">
          {/* Community Logo */}
          <div className="relative -mt-16 mb-4 sm:mb-0">
            <div className="w-32 h-32 rounded-lg border-4 border-white dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-700 shadow-lg">
              {community?.image ? (
                <img
                  src={community.image || "/placeholder.svg"}
                  alt={community.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white text-2xl font-bold">
                  {community?.name?.charAt(0)}
                </div>
              )}
            </div>
          </div>

          {/* Community Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center space-x-3">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white truncate">{community?.name}</h1>
                  {community?.is_verified ? (
                    <div className="flex items-center text-blue-600 dark:text-blue-400">
                      <ShieldCheck className="w-5 h-5 mr-1" />
                      <span className="text-sm font-medium">Verified</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center text-gray-500 dark:text-gray-400">
                        <Shield className="w-5 h-5 mr-1" />
                        <span className="text-sm">Not verified</span>
                      </div>
                      {isManager && (
                        <button
                          onClick={onShowVerification}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 text-sm font-medium transition-colors"
                        >
                          How to verify?
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {community?.organization && (
                  <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">{community.organization}</p>
                )}

                {community?.location && (
                  <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mt-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    {community.location}
                  </div>
                )}
              </div>

              {/* Management Buttons */}
              {isManager && (
                <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                  <Link
                    to="/communities/my/manage"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    Manage
                  </Link>
                  <Link
                    to="/communities/my/settings"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Community Info Component
function CommunityInfo({ community }) {
  return (
    <div className="space-y-6">
      {/* Description */}
      {community?.description && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">About</h2>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
            {community.description}
          </p>
        </div>
      )}

      {/* Community Guidelines */}
      {community?.guidelines && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Community Guidelines</h2>
          <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
            {community.guidelines}
          </div>
        </div>
      )}

      {/* Links */}
      {community?.links && community.links.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <ExternalLink className="w-5 h-5 mr-2" />
            Links & Resources
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {community.links.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
              >
                <ExternalLink className="w-4 h-4 text-gray-400 mr-3 flex-shrink-0 group-hover:text-blue-500" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 dark:text-white truncate">{link.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{link.url}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Community Sidebar Component
function CommunitySidebar({
  community,
  userMembership,
  canViewMembers,
  canRequestJoin,
  isMember,
  isManager,
  isAdmin,
  showLeaveConfirm,
  onShowMembers,
  onJoinRequest,
  onShowLeaveConfirm,
  onCancelLeave,
  onConfirmLeave,
  requestToJoinMutation,
  leaveCommunityMutation,
}) {
  const getMembershipStatus = () => {
    if (!userMembership) return null

    switch (userMembership.status) {
      case "pending":
        return (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
            <div className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">Request Pending</div>
            <div className="text-xs text-yellow-600 dark:text-yellow-300 mt-1">Your join request is being reviewed</div>
          </div>
        )
      case "approved":
        return null // Will show joined button instead
      case "rejected":
        return (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <div className="text-sm text-red-800 dark:text-red-200 font-medium">Request Rejected</div>
            <div className="text-xs text-red-600 dark:text-red-300 mt-1">Your join request was not approved</div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Community Stats */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Community Info</h3>
        <div className="space-y-4">
          {/* Members Count */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Members</span>
            {canViewMembers ? (
              <button
                onClick={onShowMembers}
                className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors"
              >
                {community?.memberCount || 0}
              </button>
            ) : (
              <span className="text-sm font-medium text-gray-900 dark:text-white">{community?.memberCount || 0}</span>
            )}
          </div>

          {/* Created Date */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Created</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {community?.createdAt
                ? new Date(community.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
                : "Unknown"}
            </span>
          </div>

          {/* Manager */}
          {community?.managerId && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Manager</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{community.managerId}</span>
            </div>
          )}
        </div>
      </div>

      {/* Membership Status */}
      {getMembershipStatus()}

      {/* Action Buttons */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="space-y-3">
          {/* Join Request Button */}
          {canRequestJoin && (
            <button
              onClick={onJoinRequest}
              disabled={requestToJoinMutation.isPending}
              className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-md transition-colors disabled:cursor-not-allowed"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              {requestToJoinMutation.isPending ? "Requesting..." : "Request to Join"}
            </button>
          )}

          {/* Joined/Leave Button */}
          {isMember && !showLeaveConfirm && (
            <button
              onClick={onShowLeaveConfirm}
              className="w-full flex items-center justify-center px-4 py-2 border border-green-300 dark:border-green-600 text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 font-medium rounded-md transition-colors"
            >
              <Users className="w-4 h-4 mr-2" />
              Joined
            </button>
          )}

          {/* Leave Confirmation */}
          {isMember && showLeaveConfirm && (
            <div className="space-y-2">
              <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
                Are you sure you want to leave this community?
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={onConfirmLeave}
                  disabled={leaveCommunityMutation.isPending}
                  className="flex-1 flex items-center justify-center px-3 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white text-sm font-medium rounded-md transition-colors disabled:cursor-not-allowed"
                >
                  <UserMinus className="w-4 h-4 mr-1" />
                  {leaveCommunityMutation.isPending ? "Leaving..." : "Leave"}
                </button>
                <button
                  onClick={onCancelLeave}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-sm font-medium rounded-md transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Success/Error Messages */}
        {requestToJoinMutation.isSuccess && (
          <div className="mt-3 rounded-md bg-green-50 dark:bg-green-900/20 p-3">
            <div className="text-sm text-green-700 dark:text-green-400">Join request submitted successfully!</div>
          </div>
        )}

        {requestToJoinMutation.error && (
          <div className="mt-3 rounded-md bg-red-50 dark:bg-red-900/20 p-3">
            <div className="text-sm text-red-700 dark:text-red-400">{requestToJoinMutation.error.message}</div>
          </div>
        )}

        {leaveCommunityMutation.error && (
          <div className="mt-3 rounded-md bg-red-50 dark:bg-red-900/20 p-3">
            <div className="text-sm text-red-700 dark:text-red-400">{leaveCommunityMutation.error.message}</div>
          </div>
        )}
      </div>
    </div>
  )
}
