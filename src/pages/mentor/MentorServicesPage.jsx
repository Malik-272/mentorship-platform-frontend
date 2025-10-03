import { useState } from "react"
import { Link } from "react-router-dom"
import { Plus, Settings, Calendar, Clock, Users, AlertCircle, Trash2, X } from "lucide-react"
import { useGetMentorServices, useDeleteService } from "../../hooks/useServices"
import LoadingSpinner from "../../ui/LoadingSpinner"
import ErrorMessage from "../../ui/ErrorMessage"
import toast from "react-hot-toast"

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

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, serviceName, isDeleting }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delete Service</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              disabled={isDeleting}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mb-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="ml-4">
                <p className="text-gray-900 dark:text-white font-medium">
                  Are you sure you want to delete this service?
                </p>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-4">
              <p className="text-sm font-medium text-gray-900 dark:text-white">Service: {serviceName}</p>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400">
              This action cannot be undone. The service and all associated data will be permanently deleted.
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              {isDeleting ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Deleting...
                </>
              ) : (
                "Delete Service"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function MentorServicesPage() {
  const [filter, setFilter] = useState("all") // all, active, inactive
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, service: null })

  // API hooks
  const {
    data: services = [],
    isLoading: servicesLoading,
    error: servicesError,
    refetch: refetchServices,
  } = useGetMentorServices()

  const deleteServiceMutation = useDeleteService()

  const handleDeleteService = async (serviceId) => {
    try {
      await deleteServiceMutation.mutateAsync(serviceId)
      setDeleteModal({ isOpen: false, service: null })
      toast.success('Service deleted successfully');

    } catch (error) {
      console.error("Error deleting service:", error)
      toast.error(error.message || "Failed to delete service. Please try again.")
    }
  }

  const openDeleteModal = (service) => {
    setDeleteModal({ isOpen: true, service })
  }

  const closeDeleteModal = () => {
    if (!deleteServiceMutation.isPending) {
      setDeleteModal({ isOpen: false, service: null })
    }
  }

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
              {
                value: "all",
                label: "All Services",
              },
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
                  to="/services/create"
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
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{service.type}</h3>
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${service.active ? "bg-green-500" : "bg-gray-400"}`} />
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
                      {service.pendingRequestsCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                          {service.pendingRequestsCount > 99 ? "99+" : service.pendingRequestsCount}
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

                    <button
                      onClick={() => openDeleteModal(service)}
                      className="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                      title="Delete service"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>

                {/* Pending Requests Alert */}
                {service.pendingRequestsCount > 0 && (
                  <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                    <div className="flex items-center text-amber-800 dark:text-amber-200">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">
                        You have {service.pendingRequestsCount} pending session request
                        {service.pendingRequestsCount !== 1 ? "s" : ""} for this service
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

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={() => handleDeleteService(deleteModal.service?.id)}
        serviceName={deleteModal.service?.type}
        isDeleting={deleteServiceMutation.isPending}
      />
    </div>
  )
}
