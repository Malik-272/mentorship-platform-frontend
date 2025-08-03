import { useState } from "react"
import { X, Users, Search, Crown, Shield, User } from "lucide-react"
import { useGetCommunityMembers } from "../../hooks/useCommunities"
import LoadingSpinner from "../../ui/LoadingSpinner"

export default function MembersModal({ isOpen, onClose, communityId, communityName }) {
  const [searchTerm, setSearchTerm] = useState("")
  const { data: membersData, isLoading, error } = useGetCommunityMembers(communityId, isOpen)

  const filteredMembers =
    membersData?.members?.filter(
      (member) =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.id.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || []

  const getRoleIcon = (role) => {
    switch (role) {
      case "COMMUNITY_MANAGER":
        return <Crown className="w-4 h-4 text-purple-600 dark:text-purple-400" />
      case "MENTOR":
        return <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
      case "MENTEE":
        return <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
      default:
        return <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
    }
  }

  const getRoleLabel = (role) => {
    switch (role) {
      case "COMMUNITY_MANAGER":
        return "Manager"
      case "MENTOR":
        return "Mentor"
      case "MENTEE":
        return "Mentee"
      default:
        return role
    }
  }

  const getInitials = (name) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-lg">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full mr-3">
                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Community Members</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{communityName}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Members List */}
          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner text="Loading members..." />
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <div className="text-red-600 dark:text-red-400">Failed to load members</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{error.message}</div>
              </div>
            ) : filteredMembers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <div className="text-gray-500 dark:text-gray-400">
                  {searchTerm ? "No members found matching your search" : "No members found"}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium mr-3 flex-shrink-0">
                      {member.imageUrl ? (
                        <img
                          src={member.imageUrl || "/placeholder.svg"}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        getInitials(member.name)
                      )}
                    </div>

                    {/* Member Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <div className="text-sm font-medium text-gray-900 dark:text-white truncate">{member.name}</div>
                        {getRoleIcon(member.role)}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">@{member.id}</div>
                        <span className="text-xs text-gray-400">•</span>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{getRoleLabel(member.role)}</div>
                      </div>
                    </div>

                    {/* Join Date */}
                    <div className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0">
                      Joined{" "}
                      {new Date(member.joinedAt).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
              <span>
                {filteredMembers.length} of {membersData?.members?.length || 0} members
                {searchTerm && " (filtered)"}
              </span>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
