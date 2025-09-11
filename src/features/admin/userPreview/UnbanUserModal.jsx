"use client"

import { useState } from "react"
import { CheckCircle, AlertTriangle, X } from "lucide-react"

export default function UnbanUserModal({ isOpen, onClose, onConfirm, user }) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      await onConfirm()
    } catch (error) {
      console.error("Failed to unban user:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen || !user) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

        <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <div className="bg-white dark:bg-gray-800 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-green-600 flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Unban User
              </h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Info */}
              <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-green-800 dark:text-green-200 mb-1">Restore User Access</p>
                  <p className="text-green-700 dark:text-green-300">
                    The user will regain full access to the platform and all features.
                  </p>
                </div>
              </div>

              {/* User Info */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="relative h-12 w-12 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                  {user.basicDetails.imageUrl ? (
                    <img
                      src={user.basicDetails.imageUrl || "/placeholder.svg"}
                      alt={user.basicDetails.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center font-semibold text-gray-600 dark:text-gray-300">
                      {user.basicDetails.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-medium">{user.basicDetails.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">ID: {user.basicDetails.id}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{user.basicDetails.email}</p>
                </div>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400">
                Are you sure you want to unban this user? They will immediately regain access to their account.
              </p>

              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Unbanning User...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Unban User
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
