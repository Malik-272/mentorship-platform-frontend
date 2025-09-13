import { useNavigate } from "react-router-dom"
import { AlertTriangle, Shield, ExternalLink } from "lucide-react"

export default function AdminDashboard({ data }) {
  const navigate = useNavigate()

  const { pendingReports = [], bannedUsers = [] } = data || {}

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Pending User Reports Menu */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div
          className="p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          onClick={() => navigate("/management/user-reports")}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <AlertTriangle className="h-6 w-6 text-orange-500 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Pending User Reports</h3>
            </div>
            <ExternalLink className="h-4 w-4 text-gray-400" />
          </div>

          {pendingReports.length > 0 ? (
            <div className="space-y-3">
              {pendingReports.slice(0, 5).map((report) => (
                <div key={report.id} className="border-l-4 border-orange-500 pl-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">@{report.reportedUserId}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Reported by @{report.reporterId}</p>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(report.reportedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 truncate">{report.reason}</p>
                </div>
              ))}
              {pendingReports.length > 5 && (
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  +{pendingReports.length - 5} more reports
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">No pending reports at the moment.</p>
          )}
        </div>
      </div>

      {/* Banned Users Menu */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div
          className="p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          onClick={() => navigate("/management/banned-users")}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Shield className="h-6 w-6 text-red-500 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Banned Users</h3>
            </div>
            <ExternalLink className="h-4 w-4 text-gray-400" />
          </div>

          {bannedUsers.length > 0 ? (
            <div className="space-y-3">
              {bannedUsers.slice(0, 5).map((ban) => (
                <div key={ban.id} className="border-l-4 border-red-500 pl-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">@{ban.bannedUserId}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Banned by @{ban.bannedById}</p>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(ban.dateBanned).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 truncate">{ban.banReason}</p>
                </div>
              ))}
              {bannedUsers.length > 5 && (
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  +{bannedUsers.length - 5} more bans
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">No banned users at the moment.</p>
          )}
        </div>
      </div>
    </div>
  )
}

