import { useNavigate } from "react-router-dom"
import { AlertTriangle, Shield, ExternalLink, User } from "lucide-react"

export default function AdminDashboard({ data }) {
  const navigate = useNavigate()

  // Destructure with default values to prevent errors if data is null or undefined
  const { userReports = {}, bannedUsers = [] } = data || {}
  const pendingReports = userReports?.userReports?.pending

  // Custom container component for reusability and consistent styling
  const DashboardCard = ({ title, icon, iconColor, count, navigateTo, children }) => (
    <div
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700
                 transform transition-all duration-300 hover:scale-[1.02] cursor-pointer"
      onClick={() => navigate(navigateTo)}
    >
      <div className="p-6">
        {/* Card Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className={`p-2 rounded-full ${iconColor} bg-opacity-10 mr-3`}>
              {icon}
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
          </div>
          <div className="flex items-center space-x-2">
            {count !== undefined && (
              <span className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-semibold px-2 py-1 rounded-full">
                {count}
              </span>
            )}
            <ExternalLink className="h-5 w-5 text-gray-400" />
          </div>
        </div>
        {/* Card Content */}
        {children}
      </div>
    </div>
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Pending User Reports Card */}
      <DashboardCard
        title="Pending User Reports"
        icon={<AlertTriangle className="h-5 w-5" />}
        iconColor="text-orange-500"
        count={pendingReports?.length || 0}
        navigateTo="/management/user-reports"
      >
        {pendingReports?.length > 0 ? (
          <div className="space-y-4">
            {pendingReports.slice(0, 5).map((report) => (
              <div
                key={report.id}
                className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600
                           transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      Reported: <span className="font-normal text-blue-500 dark:text-blue-400">@{report.reportedUserId}</span>
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                      By: <span className="font-medium">@{report.userId}</span>
                    </p>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 ml-4">
                    {new Date(report.reportedAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">{report.reason}</p>
              </div>
            ))}
            {pendingReports.length > 5 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-4">
                +{pendingReports.length - 5} more reports
              </p>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center py-6">
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">No pending reports to review.</p>
          </div>
        )}
      </DashboardCard>

      {/* Banned Users Card */}
      <DashboardCard
        title="Recently Banned"
        icon={<Shield className="h-5 w-5" />}
        iconColor="text-red-500"
        count={bannedUsers?.bannedUsers?.length || 0}
        navigateTo="/management/banned-users"
      >
        {bannedUsers?.bannedUsers?.length > 0 ? (
          <div className="space-y-4">
            {bannedUsers?.bannedUsers?.slice(0, 5).map((ban) => (
              <div
                key={ban.id}
                className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600
                           transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      User: <span className="font-normal text-red-500 dark:text-red-400">@{ban.id}</span>
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                      Banned By: <span className="font-medium">@{ban.bannedBy}</span>
                    </p>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 ml-4">
                    {new Date(ban.bannedAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">{ban.banReason}</p>
              </div>
            ))}
            {bannedUsers?.bannedUsers?.length > 5 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-4">
                +{bannedUsers?.bannedUsers?.length - 5} more users
              </p>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center py-6">
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">No users are currently banned.</p>
          </div>
        )}
      </DashboardCard>
    </div>
  )
}
