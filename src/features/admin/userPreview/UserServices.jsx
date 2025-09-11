import { Star } from "lucide-react"

export default function UserServices({ user }) {
  if (!user.services || user.services.length === 0) return null

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
          <Star className="h-5 w-5" />
          Services ({user.services.length})
        </h3>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {user.services.map((service) => (
            <div key={service.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-medium">{service.type}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">ID: {service.id}</p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                  {service.acceptedRequestsCount} accepted requests
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <p>
                    <span className="font-medium">Session Time:</span> {service.sessionTime} minutes
                  </p>
                  <p>
                    <span className="font-medium">Created:</span> {formatDate(service.createdAt)}
                  </p>
                </div>
              </div>
              {service.dsecription && (
                <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm">
                    <span className="font-medium">Description:</span> {service.dsecription}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}