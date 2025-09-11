import { Users } from "lucide-react"

export default function UserCommunities({ user }) {
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