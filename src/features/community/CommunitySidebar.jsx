import { Users, UserPlus, UserMinus, X, Clock } from "lucide-react"

export default function CommunitySidebar({
  community,
  userMembership,
  canViewMembers,
  canRequestJoin,
  isMember,
  isPending,
  isCommunityManager,
  isManager,
  isAdmin,
  showLeaveConfirm,
  message,
  onShowMembers,
  onJoinRequest,
  onCancelJoinRequest,
  onShowLeaveConfirm,
  onCancelLeave,
  onConfirmLeave,
  requestToJoinMutation,
  cancelJoinRequestMutation,
  leaveCommunityMutation,
}) {
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

      {/* Action Buttons */}
      {!isCommunityManager && <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="space-y-4">
          {/* Join Request Button - Show when user can request to join */}
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

          {/* Pending Request Status - Show when request is pending */}
          {isPending && (
            <div className="space-y-3">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mr-2" />
                    <div>
                      <div className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">Request Sent</div>
                      <div className="text-xs text-yellow-600 dark:text-yellow-300 mt-1">Waiting for approval</div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={onCancelJoinRequest}
                disabled={cancelJoinRequestMutation.isPending}
                className="w-full flex items-center justify-center px-4 py-2 border border-red-300 dark:border-red-600 text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 font-medium rounded-md transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X className="w-4 h-4 mr-2" />
                {cancelJoinRequestMutation.isPending ? "Canceling..." : "Cancel Request"}
              </button>
            </div>
          )}

          {/* Member Status - Show when user is a member */}
          {isMember && !showLeaveConfirm && (
            <div className="space-y-3">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="flex items-center">
                  <Users className="w-4 h-4 text-green-600 dark:text-green-400 mr-2" />
                  <div>
                    <div className="text-sm text-green-800 dark:text-green-200 font-medium">You're a Member</div>
                    <div className="text-xs text-green-600 dark:text-green-300 mt-1">Welcome to the community!</div>
                  </div>
                </div>
              </div>

              <button
                onClick={onShowLeaveConfirm}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 font-medium rounded-md transition-colors"
              >
                <UserMinus className="w-4 h-4 mr-2" />
                Leave Community
              </button>
            </div>
          )}

          {/* Leave Confirmation */}
          {isMember && showLeaveConfirm && (
            <div className="space-y-3">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="text-sm text-red-800 dark:text-red-200 font-medium text-center">
                  Are you sure you want to leave?
                </div>
                <div className="text-xs text-red-600 dark:text-red-300 mt-1 text-center">
                  You can rejoin anytime by sending a new request
                </div>
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

        {/* Single Message Display - Only show one message at a time */}
        {message && (
          <div
            className={`mt-4 rounded-md border p-3 ${message.type === "success"
              ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
              : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
              }`}
          >
            <div
              className={`text-sm text-center ${message.type === "success" ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"
                }`}
            >
              {message.text}
            </div>
          </div>
        )}
      </div>}
    </div>
  )
}
