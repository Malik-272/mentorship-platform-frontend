import { useState } from "react"
import { Link } from "react-router-dom"
import { CheckCircle, Clock, User, Calendar, ChevronDown, ExternalLink, Shield, X, Ban, FileText } from "lucide-react"
import { useUserReports } from "../../hooks/useUserReports"
import LoadingSpinner from "../../ui/LoadingSpinner"
import ErrorMessage from "../../ui/ErrorMessage"
import BanConfirmationModal from "../../features/admin/BanConfirmationModal"
import DiscardConfirmationModal from "../../features/admin/DiscardConfirmationModal"

export default function UserReportsPage() {
  const { data: reportsData, isLoading, error, refetch } = useUserReports()
  const [selectedReport, setSelectedReport] = useState(null)
  const [showBanModal, setShowBanModal] = useState(false)
  const [showDiscardModal, setShowDiscardModal] = useState(false)
  const [activeTab, setActiveTab] = useState("pending")
  const [openDropdown, setOpenDropdown] = useState(null)

  // console.log("reportsData", reportsData)
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleActionClick = (report, action) => {
    setSelectedReport(report)
    setOpenDropdown(null)

    if (action === "ban") {
      setShowBanModal(true)
    } else if (action === "discard") {
      setShowDiscardModal(true)
    }
  }

  const toggleDropdown = (reportId) => {
    setOpenDropdown(openDropdown === reportId ? null : reportId)
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <ErrorMessage message="Failed to load user reports" onRetry={refetch} />
  }

  const pendingReports = reportsData?.userReports?.pending || []
  const resolvedReports = reportsData?.userReports?.resolved || []

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
            <Shield className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Reports Management</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Review and manage user reports submitted by the community
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{pendingReports.length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Pending Reports</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{resolvedReports.length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Resolved Reports</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("pending")}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === "pending"
                ? "border-orange-500 text-orange-600 dark:text-orange-400"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
            >
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Pending Reports ({pendingReports.length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab("resolved")}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === "resolved"
                ? "border-green-500 text-green-600 dark:text-green-400"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Resolved Reports ({resolvedReports.length})
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      {activeTab === "pending" && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          {pendingReports.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Pending Reports</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Great! There are no pending user reports to review at the moment.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Reported User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Reporter
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Violation
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Additional Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Reported At
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {pendingReports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          to={`/profile/${report.reportedUserId}`}
                          className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
                        >
                          <User className="w-4 h-4" />
                          {report.reportedUserId}
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          to={`/profile/${report.userId}`}
                          className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
                        >
                          <User className="w-4 h-4" />
                          {report.userId}
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          <p className="text-sm text-gray-900 dark:text-white font-medium">{report.reason}</p>
                          {report.violation && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{report.violation}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 align-top max-w-xs">
                        <div className="flex flex-col">
                          <p className="text-sm text-gray-900 dark:text-white font-medium break-words whitespace-normal">
                            {report.reason}
                          </p>
                          {report.additionalDetails && (
                            <p
                              className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate"
                              title={report.additionalDetails}
                            >
                              {report.additionalDetails}
                            </p>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                          <Calendar className="w-4 h-4" />
                          {formatDate(report.reportedAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          {/* Ban User */}
                          <button
                            onClick={() => handleActionClick(report, "ban")}
                            className="p-2 rounded-full text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                            title="Ban User"
                          >
                            <Ban className="w-5 h-5" />
                          </button>

                          {/* Discard Report */}
                          <button
                            onClick={() => handleActionClick(report, "discard")}
                            className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            title="Discard Report"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === "resolved" && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          {resolvedReports.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-900/20 rounded-full flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Resolved Reports</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Resolved reports will appear here once you take action on pending reports.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Reported User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Reporter
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Violation
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Additional Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Reported At
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Resolved By
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {resolvedReports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          to={`/profile/${report.reportedUserId}`}
                          className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
                        >
                          <User className="w-4 h-4" />
                          {report.reportedUserId}
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          to={`/profile/${report.userId}`}
                          className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
                        >
                          <User className="w-4 h-4" />
                          {report.userId}
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          <p className="text-sm text-gray-900 dark:text-white font-medium">{report.reason}</p>
                          {report.violation && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{report.violation}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 align-top max-w-xs">
                        <div className="flex flex-col">
                          <p className="text-sm text-gray-900 dark:text-white font-medium break-words whitespace-normal">
                            {report.reason}
                          </p>
                          {report.additionalDetails && (
                            <p
                              className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate"
                              title={report.additionalDetails}
                            >
                              {report.additionalDetails}
                            </p>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                          <Calendar className="w-4 h-4" />
                          {formatDate(report.reportedAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="p-1 bg-green-100 dark:bg-green-900/20 rounded">
                            <Shield className="w-3 h-3 text-green-600 dark:text-green-400" />
                          </div>
                          <span className="text-sm text-gray-900 dark:text-white font-medium">{report.resolvedBy}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      {/* Modals */}
      {showBanModal && selectedReport && (
        <BanConfirmationModal
          report={selectedReport}
          onClose={() => {
            setShowBanModal(false)
            setSelectedReport(null)
          }}
          onSuccess={() => {
            setShowBanModal(false)
            setSelectedReport(null)
            refetch()
          }}
        />
      )}

      {showDiscardModal && selectedReport && (
        <DiscardConfirmationModal
          report={selectedReport}
          onClose={() => {
            setShowDiscardModal(false)
            setSelectedReport(null)
          }}
          onSuccess={() => {
            setShowDiscardModal(false)
            setSelectedReport(null)
            refetch()
          }}
        />
      )}
    </div>
  )
}
