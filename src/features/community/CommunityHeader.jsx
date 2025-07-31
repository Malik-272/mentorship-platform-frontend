import { Shield, ShieldCheck, Settings, Crown, MapPin } from "lucide-react"
import { Link } from "react-router-dom"

export default function CommunityHeader({ community, isManager, isAdmin, onShowVerification }) {
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
              {community?.imageUrl ? (
                <img
                  src={community.imageUrl || "/placeholder.svg"}
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
