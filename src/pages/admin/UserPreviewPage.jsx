import { useState } from "react"
import { useSearchParams } from "react-router-dom"
import {
  Search,
  User,
  Mail,
  Globe,
  Calendar,
  Shield,
  ShieldCheck,
  Ban,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  ExternalLink,
  Users,
  Star,
  MapPin,
  Zap,
} from "lucide-react"

import LoadingSpinner from "../../ui/LoadingSpinner"
import ErrorMessage from "../../ui/ErrorMessage"
import BanUserModal from "../../features/admin/BanUserModal"
import UnbanUserModal from "../../features/admin/UnbanUserModal"

// Import the new React Query hooks
import { useUserPreview, useBanUser, useUnbanUser } from "../../hooks/useUserPreview"

export default function UserPreviewPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchId, setSearchId] = useState(searchParams.get("id") || "")
  const [showBanModal, setShowBanModal] = useState(false)
  const [showUnbanModal, setShowUnbanModal] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  const userId = searchParams.get("id")

  const { data: user, isLoading, error } = useUserPreview(userId)
  const { mutate: banUser, isLoading: isBanning } = useBanUser()
  const { mutate: unbanUser, isLoading: isUnbanning } = useUnbanUser()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchId.trim()) {
      setSearchParams({ id: searchId.trim() })
    }
  }

  const handleBanUser = (banReason) => {
    // Add a pre-check to prevent banning an admin
    if (user?.basicDetails?.role === "ADMIN") {
      console.warn("Attempt to ban another admin was prevented.");
      return; // Exit the function
    }

    banUser(
      { userId, banReason },
      {
        onSuccess: () => setShowBanModal(false),
        onError: (err) => console.error("Failed to ban user:", err),
      }
    )
  }

  const handleUnbanUser = () => {
    unbanUser(userId, {
      onSuccess: () => setShowUnbanModal(false),
      onError: (err) => console.error("Failed to unban user:", err),
    })
  }

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

  const renderBasicInfo = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <User className="h-5 w-5" />
          Basic Information
        </h3>
      </div>
      <div className="p-6 space-y-4">
        <div className="flex items-start gap-4">
          <div className="relative h-20 w-20 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
            {user.basicDetails.imageUrl ? (
              <img
                src={user.basicDetails.imageUrl || "/placeholder.svg"}
                alt={user.basicDetails.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-lg font-semibold text-gray-600 dark:text-gray-300">
                {user.basicDetails.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
            )}
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">{user.basicDetails.name}</h2>
              {user.basicDetails.verified && <ShieldCheck className="h-5 w-5 text-blue-500" />}
              {user.basicDetails.isBanned && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 ml-2">
                  <Ban className="h-3 w-3 mr-1" />
                  Banned
                </span>
              )}
            </div>
            <p className="text-gray-600 dark:text-gray-400">{user.basicDetails.headline}</p>
            {user.basicDetails.bio && <p className="text-sm">{user.basicDetails.bio}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">ID:</span>
              <span className="text-sm">{user.basicDetails.id}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Email:</span>
              <span className="text-sm">{user.basicDetails.email}</span>
              {user.basicDetails.verified && <CheckCircle className="h-4 w-4 text-green-500" />}
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Country:</span>
              <span className="text-sm">{user.basicDetails.country}</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Timezone:</span>
              <span className="text-sm">{user.basicDetails.timezone}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Role:</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                {user.basicDetails.role}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Joined:</span>
              <span className="text-sm">{formatDate(user.basicDetails.dateJoined)}</span>
            </div>
            {user.basicDetails.skills && user.basicDetails.skills.length > 0 && (
              <div className="flex items-start gap-2">
                <Zap className="h-4 w-4 text-gray-500 mt-0.5" />
                <span className="text-sm font-medium">Skills:</span>
                <div className="flex flex-wrap gap-1">
                  {user.basicDetails.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  const renderLinks = () => {
    if (!user.links || user.links.length === 0) return null

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <ExternalLink className="h-5 w-5" />
            Links
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-2">
            {user.links.map((link, index) => (
              <div key={index} className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">{link.name}:</span>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                >
                  {link.url}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const renderCommunities = () => {
    if (!user.communities || user.communities.length === 0) return null

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Users className="h-5 w-5" />
            Communities ({user.communities.length})
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {user.communities.map((community) => (
              <div
                key={community.communityId}
                className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div className="relative h-12 w-12 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                  {community.imageUrl ? (
                    <img
                      src={community.imageUrl || "/placeholder.svg"}
                      alt={community.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center font-semibold text-gray-600 dark:text-gray-300">
                      {community.name[0]}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{community.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">ID: {community.communityId}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const renderSessionRequests = () => {
    if (!user.sessionRequests) return null

    const allRequests = Object.entries(user.sessionRequests).flatMap(([status, requests]) =>
      requests.map((request) => ({ ...request, status })),
    )

    if (allRequests.length === 0) return null

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

  const renderServices = () => {
    if (!user.services || user.services.length === 0) return null

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Star className="h-5 w-5" />
            Services ({user.services.length})
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {user.services.map((service) => (
              <div key={service.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium">{service.type}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">ID: {service.id}</p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                    {service.acceptedRequestsCount} accepted requests
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <p>
                      <span className="font-medium">Session Time:</span> {service.sessionTime} minutes
                    </p>
                    <p>
                      <span className="font-medium">Created:</span> {formatDate(service.createdAt)}
                    </p>
                  </div>
                </div>
                {service.dsecription && (
                  <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm">
                      <span className="font-medium">Description:</span> {service.dsecription}
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

  const renderCommunityOwnership = () => {
    if (!user.community) return null

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Users className="h-5 w-5" />
            Owned Community
          </h3>
        </div>
        <div className="p-6">
          <div className="flex items-start gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="relative h-16 w-16 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
              {user.community.imageUrl ? (
                <img
                  src={user.community.imageUrl || "/placeholder.svg"}
                  alt={user.community.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-lg font-semibold text-gray-600 dark:text-gray-300">
                  {user.community.name[0]}
                </div>
              )}
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <h4 className="text-lg font-medium">{user.community.name}</h4>
                {user.community.verified && <ShieldCheck className="h-5 w-5 text-blue-500" />}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">ID: {user.community.id}</p>
              <p className="text-sm">{user.community.description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {user.community.membersCount} members
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Created {formatDate(user.community.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">User Preview</h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Enter user ID to search..."
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <button
              type="submit"
              disabled={!searchId.trim()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Search className="h-4 w-4 mr-2" />
              Search
            </button>
          </form>
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      )}

      {error && !isLoading && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <ErrorMessage message={error} />
          </div>
        </div>
      )}

      {user && !isLoading && !error && (
        <div className="space-y-6">
          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            {/* Conditional Rendering of Ban/Unban buttons */}
            {user.basicDetails.role !== "ADMIN" && (
              <>
                {user.basicDetails.isBanned ? (
                  <button
                    onClick={() => setShowUnbanModal(true)}
                    className="inline-flex items-center px-4 py-2 border border-green-600 text-sm font-medium rounded-md text-green-600 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:bg-gray-800 dark:hover:bg-green-950"
                    disabled={isUnbanning}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Unban User
                  </button>
                ) : (
                  <button
                    onClick={() => setShowBanModal(true)}
                    className="inline-flex items-center px-4 py-2 border border-red-600 text-sm font-medium rounded-md text-red-600 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:bg-gray-800 dark:hover:bg-red-950"
                    disabled={isBanning}
                  >
                    <Ban className="h-4 w-4 mr-2" />
                    Ban User
                  </button>
                )}
              </>
            )}
            {/* You could add an else block here to show a message if the user is an admin,
                for example: `user.basicDetails.role === "ADMIN" && <span className="text-sm text-gray-500">Cannot ban administrators.</span>`
            */}
          </div>

          {renderBasicInfo()}
          {renderLinks()}
          {renderCommunities()}
          {user.basicDetails.role === "MENTEE" && renderSessionRequests()}
          {user.basicDetails.role === "MENTOR" && (
            <>
              {renderServices()}
              {renderCommunities()}
            </>
          )}
          {user.basicDetails.role === "COMMUNITY_MANAGER" && renderCommunityOwnership()}
        </div>
      )}

      <BanUserModal
        isOpen={showBanModal}
        onClose={() => setShowBanModal(false)}
        onConfirm={handleBanUser}
        user={user}
      />

      <UnbanUserModal
        isOpen={showUnbanModal}
        onClose={() => setShowUnbanModal(false)}
        onConfirm={handleUnbanUser}
        user={user}
      />
    </div>
  )
}