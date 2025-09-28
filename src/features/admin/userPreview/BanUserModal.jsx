"use client"

import { useState } from "react"
import { Ban, AlertTriangle, X } from "lucide-react"

export default function BanUserModal({ isOpen, onClose, onConfirm, user }) {
  const [banReason, setBanReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!banReason.trim()) return

    setIsSubmitting(true)
    try {
      await onConfirm(banReason.trim())
      setBanReason("")
    } catch (error) {
      console.error("Failed to ban user:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setBanReason("")
    onClose()
  }

  if (!isOpen || !user) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={handleClose} />

        <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <div className="bg-white dark:bg-gray-800 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-red-600 flex items-center gap-2">
                <Ban className="h-5 w-5" />
                Ban User
              </h3>
              <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Warning */}
              <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-red-800 dark:text-red-200 mb-1">
                    Warning: This action cannot be undone
                  </p>
                  <p className="text-red-700 dark:text-red-300">
                    The user will be immediately banned from the platform and will lose access to all features.
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

              {/* Ban Reason Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="banReason" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Ban Reason <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="banReason"
                    placeholder="Please provide a detailed reason for banning this user..."
                    value={banReason}
                    onChange={(e) => setBanReason(e.target.value)}
                    className="w-full min-h-[100px] px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white resize-none"
                    maxLength={100}
                    required
                  />
                  <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                    <span>Minimum 10 characters required</span>
                    <span>{banReason.length}/100</span>
                  </div>
                </div>

                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!banReason.trim() || banReason.trim().length < 10 || isSubmitting}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Banning User...
                      </>
                    ) : (
                      <>
                        <Ban className="h-4 w-4 mr-2" />
                        Ban User
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
