import { User, Mail, Globe, Calendar, Shield, ShieldCheck, Ban, MapPin, Zap, CheckCircle } from "lucide-react"
import { countryCodes as country } from "../../../data/authData"

export default function BasicInfo({ user }) {
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
              <span className="text-sm">{country[user.basicDetails.country]}</span>
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
}