import { Users, UserPlus, UserMinus } from "lucide-react"

export default function CommunitySidebar({
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
  // const getMembershipStatus = () => {
  //   if (!userMembership) return null

  //   switch (userMembership) {
  //     case "PENDING":
  //       return (
  //         <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
  //           <div className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">Request Pending</div>
  //           <div className="text-xs text-yellow-600 dark:text-yellow-300 mt-1">Your join request is being reviewed</div>
  //         </div>
  //       )
  //     case "MEMBER":
  //       return null // Will show joined button instead
  //     // case "rejected":
  //     //   return (
  //     //     <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
  //     //       <div className="text-sm text-red-800 dark:text-red-200 font-medium">Request Rejected</div>
  //     //       <div className="text-xs text-red-600 dark:text-red-300 mt-1">Your join request was not approved</div>
  //     //     </div>
  //     //   )
  //     case "NONE":
  //       return null
  //     default:
  //       return null
  //   }
  // }

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
      {userMembership === "PENDING" && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
          <div className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">Request Pending</div>
          <div className="text-xs text-yellow-600 dark:text-yellow-300 mt-1">Your join request is being reviewed</div>
        </div>
      )}
      {/* {getMembershipStatus()} */}

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