import { Users, Calendar, ShieldCheck } from "lucide-react"
import { Link } from "react-router-dom"

export default function CommunityOwnership({ user }) {
  if (!user.community || Object.keys(user.community).length === 0) return null

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

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
            <Link
            to={`/communities/${user.community.id}`}
            className="flex-1 block"
            >
              <p className="text-sm text-blue-600 dark:text-blue-400">@{user.community.id}</p>
            </Link>
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