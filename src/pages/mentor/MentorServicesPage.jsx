import { useState } from "react"
import { Link } from "react-router-dom"
import { Plus, Settings, Calendar, Clock, Users, AlertCircle } from 'lucide-react'
import { useGetMentorServices } from "../../hooks/useServices"
import LoadingSpinner from "../../ui/LoadingSpinner"
import ErrorMessage from "../../ui/ErrorMessage"

const formatDuration = (minutes) => {
  if (minutes < 60) {
    return `${minutes}min`
  }
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  if (remainingMinutes === 0) {
    return `${hours}h`
  }
  return `${hours}h ${remainingMinutes}min`
}

export default function MentorServicesPage() {
  const [filter, setFilter] = useState("all") // all, active, inactive

  // API hooks
  const {
    data: services = [],
    isLoading: servicesLoading,
    error: servicesError,
    refetch: refetchServices,
  } = useGetMentorServices()


  // Authentication and authorization checks
  if (servicesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (servicesError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorMessage message="Failed to load your services" onRetry={refetchServices} />
      </div>
    )
  }

  // Filter services based on selected filter
  const filteredServices = services.filter((service) => {
    if (filter === "active") return service.active
    if (filter === "inactive") return !service.active
    return true
  })

  const stats = {
    total: services.length,
    active: services.filter((s) => s.active).length,
    inactive: services.filter((s) => !s.active).length,
    totalPendingRequests: services.reduce((sum, service) => sum + (service.pendingRequestsCount || 0), 0),
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">My Services</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your mentoring services and track session requests
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Link
                to="/services/create"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Service</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Services</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              </div>
            </div>
          </div>

          {/* <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <Eye className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Services</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.active}</p>
              </div>
            </div>
          </div> */}

          {/* <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <EyeOff className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Inactive Services</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.inactive}</p>
              </div>
            </div>
          </div> */}

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Requests</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalPendingRequests}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">Filter:</span>
            {[
              { value: "all", label: "All Services" },
              { value: "active", label: "Active Only" },
              { value: "inactive", label: "Inactive Only" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${filter === option.value
                  ? "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Services List */}
        <div className="space-y-4">
          {filteredServices.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <Settings className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {filter === "all" ? "No services yet" : `No ${filter} services`}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {filter === "all"
                  ? "Create your first mentoring service to start helping others grow."
                  : `You don't have any ${filter} services at the moment.`}
              </p>
              {filter === "all" && (
                <Link
                  to="/my/services/new"
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Your First Service</span>
                </Link>
              )}
            </div>
          ) : (
            filteredServices.map((service) => (
              <div
                key={service.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  {/* Service Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {service.type}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <div
                            className={`w-2 h-2 rounded-full ${service.active ? "bg-green-500" : "bg-gray-400"
                              }`}
                          />
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded-full ${service.active
                              ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                              }`}
                          >
                            {service.active ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>
                      {/* <button
                        onClick={() => handleToggleStatus(service.id, service.isActive)}
                        disabled={toggleServiceMutation.isPending}
                        className={`p-1 rounded-md transition-colors ${service.isActive
                          ? "text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20"
                          : "text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                          }`}
                        title={service.isActive ? "Deactivate service" : "Activate service"}
                      >
                        {service.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button> */}
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{service.description}</p>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatDuration(service.sessionTime)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{service.acceptedRequestsCount || 0} sessions completed</span>
                      </div>
                      <div className="text-xs text-gray-400">
                        Created {new Date(service.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 mt-4 lg:mt-0 lg:ml-6">
                    {/* Session Requests Link */}
                    <Link
                      to={`/my/services/${service.id}/session-requests`}
                      className="relative inline-flex items-center justify-center space-x-2 px-4 py-2 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Session Requests</span>
                      {service.pendingRequests > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                          {service.pendingRequests > 99 ? "99+" : service.pendingRequests}
                        </span>
                      )}
                    </Link>

                    {/* Service Management Link */}
                    <Link
                      to={`/my/services/${service.id}`}
                      className="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Manage Service</span>
                    </Link>
                  </div>
                </div>

                {/* Pending Requests Alert */}
                {service.pendingRequests > 0 && (
                  <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                    <div className="flex items-center text-amber-800 dark:text-amber-200">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">
                        You have {service.pendingRequests} pending session request
                        {service.pendingRequests !== 1 ? "s" : ""} for this service
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Load More / Pagination could go here if needed */}
        {filteredServices.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing {filteredServices.length} of {services.length} services
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

