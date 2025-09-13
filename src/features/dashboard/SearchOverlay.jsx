import { Users, Building2, CheckCircle, Loader2 } from "lucide-react";

export default function SearchOverlay({ results, loading, onUserClick, onCommunityClick, onClose }) {
  const { users = [], communities = [] } = results;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />

      {/* Search Results Container */}
      <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto z-50 transform-gpu transition-transform animate-slide-in">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            <span className="ml-3 text-sm font-medium text-gray-600 dark:text-gray-400">Searching...</span>
          </div>
        ) : (
          <>
            {users.length === 0 && communities.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500 dark:text-gray-400 font-medium">No results found. Try a different search.</p>
              </div>
            ) : (
              <div className="py-1">
                {/* Users Section */}
                {users.length > 0 && (
                  <div className="py-2">
                    <h3 className="flex items-center px-4 mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      <Users className="h-3 w-3 mr-2" />
                      Users
                    </h3>
                    {users.map((user) => (
                      <button
                        key={user.id}
                        onClick={() => onUserClick(user.id)}
                        className="w-full px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-3 transition-colors duration-200"
                      >
                        <div className="flex-shrink-0">
                          {user.imageUrl ? (
                            <img
                              src={user.imageUrl || "/placeholder.svg"}
                              alt={user.name}
                              className="h-9 w-9 rounded-full object-cover border border-gray-200 dark:border-gray-600"
                            />
                          ) : (
                            <div className="h-9 w-9 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 text-left overflow-hidden">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">@{user.id}</p>
                          {user.headline && (
                            <p className="text-xs text-gray-400 dark:text-gray-500 truncate mt-0.5">{user.headline}</p>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Communities Section */}
                {communities.length > 0 && (
                  <div className="py-2">
                    <h3 className="flex items-center px-4 mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      <Building2 className="h-3 w-3 mr-2" />
                      Communities
                    </h3>
                    {communities.map((community) => (
                      <button
                        key={community.id}
                        onClick={() => onCommunityClick(community.id)}
                        className="w-full px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-3 transition-colors duration-200"
                      >
                        <div className="flex-shrink-0">
                          {community.imageUrl ? (
                            <img
                              src={community.imageUrl || "/placeholder.svg"}
                              alt={community.name}
                              className="h-9 w-9 rounded-lg object-cover border border-gray-200 dark:border-gray-600"
                            />
                          ) : (
                            <div className="h-9 w-9 rounded-lg bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                              <Building2 className="h-5 w-5 text-gray-500" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 text-left overflow-hidden">
                          <div className="flex items-center space-x-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{community.name}</p>
                            {community.verified && <CheckCircle className="h-4 w-4 text-blue-500" />}
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">@{community.id}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
