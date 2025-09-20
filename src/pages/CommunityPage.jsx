import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useCancelRequestToJoin, useGetCommunity, useGetCommunityServices, useLeaveCommunity, useRequestToJoin } from "../hooks/useCommunities"
import MembersModal from "../features/community/MembersModal"
import VerificationHelpModal from "../features/community/VerificationHelpModal"
import CommunitySidebar from "../features/community/CommunitySidebar"
import CommunityHeader from "../features/community/CommunityHeader"
import CommunityInfo from "../features/community/CommunityInfo"
import LoadingSpinner from "../ui/LoadingSpinner"
import ErrorMessage from "../ui/ErrorMessage"
import CommunityServices from "../features/community/CommunityServices"

export default function CommunityPage() {
  const { id } = useParams()
  const { data: currentUser } = useAuth()
  const [showMembersModal, setShowMembersModal] = useState(false)
  const [showVerificationModal, setShowVerificationModal] = useState(false)
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false)

  const [message, setMessage] = useState(null);

  const { data: communityData, isLoading, error, refetch: RefetchCommunity } = useGetCommunity(id)
  const leaveCommunityMutation = useLeaveCommunity()
  const { data: servicesData, isLoading: servicesLoading, error: servicesError } = useGetCommunityServices(id)
  const requestToJoinMutation = useRequestToJoin()
  const cancelJoinRequestMutation = useCancelRequestToJoin()

  // Clear message after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [message])

  // Reset all mutation states when component mounts or when starting new action
  const resetAllMutations = () => {
    requestToJoinMutation.reset()
    cancelJoinRequestMutation.reset()
    leaveCommunityMutation.reset()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading community..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <ErrorMessage
          title="Community Not Found"
          message={error.message || "The community you're looking for doesn't exist or has been removed."}
          showRetry={true}
          onRetry={() => window.location.reload()}
        />
      </div>
    )
  }

  const community = communityData?.community
  const user = currentUser?.user
  const userMembership = communityData?.membershipStatus
  const isAdmin = user?.role === "ADMIN"
  const isManager = (user?.role === "COMMUNITY_MANAGER" && community?.managerId === user?.id) || isAdmin
  const isCommunityManager = user?.role === "COMMUNITY_MANAGER"
  const isMember = userMembership === "MEMBER"
  const isPending = userMembership === "PENDING"
  const canViewMembers = isMember || isManager || isAdmin
  const canViewServices = isMember || isAdmin || isManager
  const canRequestJoin = (user?.role === "MENTEE" || user?.role === "MENTOR") && !isMember && !isPending

  const handleCancelJoinRequest = async () => {
    try {
      // Reset all mutations and clear any existing messages
      resetAllMutations()
      setMessage(null)

      await cancelJoinRequestMutation.mutateAsync(community.id)
      setMessage({
        type: "success",
        text: "✓ Request canceled successfully",
      })
      await RefetchCommunity()
    } catch (error) {
      console.error("Cancel join request failed:", error)
      setMessage({
        type: "error",
        text: error.message || "Failed to cancel request",
      })
    }
  }

  const handleJoinRequest = async () => {
    try {
      // Reset all mutations and clear any existing messages
      resetAllMutations()
      setMessage(null)

      await requestToJoinMutation.mutateAsync(community.id)
      setMessage({
        type: "success",
        text: "✓ Join request sent successfully!",
      })
      await RefetchCommunity()
    } catch (error) {
      console.error("Join request failed:", error)
      setMessage({
        type: "error",
        text: error.message || "Failed to send join request",
      })
    }
  }

  const handleLeave = async () => {
    try {
      // Reset all mutations and clear any existing messages
      resetAllMutations()
      setMessage(null)

      await leaveCommunityMutation.mutateAsync(community.id)
      setShowLeaveConfirm(false)
      setMessage({
        type: "success",
        text: "✓ Left community successfully",
      })
      RefetchCommunity()
    } catch (error) {
      console.error("Leave community failed:", error)
      setMessage({
        type: "error",
        text: error.message || "Failed to leave community",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CommunityHeader
          community={community}
          isManager={isManager}
          isAdmin={isAdmin}
          onShowVerification={() => setShowVerificationModal(true)}
        />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <CommunityInfo community={community} />
            {canViewServices && <CommunityServices
              services={servicesData?.services}
              isLoading={servicesLoading}
              error={servicesError}
            />}
          </div>
          <div className="lg:col-span-1">
            <CommunitySidebar
              community={community}
              userMembership={userMembership}
              canViewMembers={canViewMembers}
              canRequestJoin={canRequestJoin}
              isCommunityManager={isCommunityManager}
              isMember={isMember}
              isPending={isPending}
              isManager={isManager}
              isAdmin={isAdmin}
              showLeaveConfirm={showLeaveConfirm}
              message={message}
              onShowMembers={() => setShowMembersModal(true)}
              onJoinRequest={handleJoinRequest}
              onCancelJoinRequest={handleCancelJoinRequest}
              onShowLeaveConfirm={() => setShowLeaveConfirm(true)}
              onCancelLeave={() => setShowLeaveConfirm(false)}
              onConfirmLeave={handleLeave}
              requestToJoinMutation={requestToJoinMutation}
              cancelJoinRequestMutation={cancelJoinRequestMutation}
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
  )
}
