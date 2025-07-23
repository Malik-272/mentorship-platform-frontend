import { useState, useEffect } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { X, Plus, Trash2, ExternalLink, Save } from "lucide-react"
import { useAddLink, useUpdateLink, useDeleteLink } from "../../hooks/useSettings"
import { Link } from "react-router-dom"

export default function LinksModal({ isOpen, onClose, userLinks, onRefresh }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [pendingOperations, setPendingOperations] = useState(new Set())

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm({
    defaultValues: {
      links: userLinks?.length > 0 ? userLinks : [{ linkName: "", linkUrl: "", id: null }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "links",
  })

  const addLinkMutation = useAddLink()
  const updateLinkMutation = useUpdateLink()
  const deleteLinkMutation = useDeleteLink()

  // Reset form when userLinks change
  useEffect(() => {
    if (userLinks) {
      reset({
        links: userLinks.length > 0 ? userLinks : [{ linkName: "", linkUrl: "", id: null }],
      })
    }
  }, [userLinks, reset])

  const handleAddLink = async (linkData) => {
    try {
      await addLinkMutation.mutateAsync(linkData)
      onRefresh?.()
    } catch (error) {
      console.error("Failed to add link:", error)
      throw error
    }
  }

  const handleUpdateLink = async (id, linkData) => {
    try {
      await updateLinkMutation.mutateAsync({ id, linkData })
      onRefresh?.()
    } catch (error) {
      console.error("Failed to update link:", error)
      throw error
    }
  }

  const handleDeleteLink = async (id) => {
    try {
      setPendingOperations((prev) => new Set(prev).add(id))
      await deleteLinkMutation.mutateAsync(id)
      onRefresh?.()
    } catch (error) {
      console.error("Failed to delete link:", error)
    } finally {
      setPendingOperations((prev) => {
        const newSet = new Set(prev)
        newSet.delete(id)
        return newSet
      })
    }
  }

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      const operations = []

      for (const link of data.links) {
        // Skip empty links
        if (!link.linkName?.trim() || !link.linkUrl?.trim()) continue

        if (link.id) {
          // Update existing link
          operations.push(
            handleUpdateLink(link.id, {
              linkName: link.linkName.trim(),
              linkUrl: link.linkUrl.trim(),
            }),
          )
        } else {
          // Add new link
          operations.push(
            handleAddLink({
              linkName: link.linkName.trim(),
              linkUrl: link.linkUrl.trim(),
            }),
          )
        }
      }

      await Promise.all(operations)
      onClose()
    } catch (error) {
      console.error("Links operation failed:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRemoveLink = async (index) => {
    const formValues = getValues() // Add this to get current form values
    const databaseId = formValues.links[index]?.id

    // Only try to delete from server if it has a valid database ID
    if (databaseId && databaseId !== null && databaseId !== undefined) {
      try {
        await handleDeleteLink(databaseId)
      } catch (error) {
        console.error("Failed to delete link from server:", error)
        // Don't remove from form if server deletion failed
        return
      }
    }
    // Remove from form
    remove(index)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-lg">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Manage Social Links</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Add or edit your social media profiles and portfolio links
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Links List */}
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex items-start space-x-3 p-4 border border-gray-200 dark:border-gray-600 rounded-lg"
                >
                  <ExternalLink className="w-5 h-5 text-gray-400 mt-2 flex-shrink-0" />

                  <div className="flex-1 space-y-3">
                    <div>
                      <input
                        {...register(`links.${index}.linkName`, {
                          required: "Link name is required",
                        })}
                        placeholder="Link name (e.g., LinkedIn, GitHub)"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                      {errors.links?.[index]?.linkName && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {errors.links[index].linkName.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <input
                        {...register(`links.${index}.linkUrl`, {
                          required: "URL is required",
                          pattern: {
                            value: /^https?:\/\/.+/,
                            message: "Please enter a valid URL starting with http:// or https://",
                          },
                        })}
                        placeholder="https://example.com"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                      {errors.links?.[index]?.linkUrl && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {errors.links[index].linkUrl.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveLink(index)}
                    disabled={pendingOperations.has(field.id)}
                    className="p-2 text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Link Button */}
            <button
              type="button"
              onClick={() => append({ linkName: "", linkUrl: "", id: null })}
              className="w-full flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Another Link
            </button>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-md transition-colors disabled:cursor-not-allowed flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSubmitting ? "Saving..." : "Save Links"}
              </button>
            </div>

            {/* Error Messages */}
            {(addLinkMutation.error || updateLinkMutation.error || deleteLinkMutation.error) && (
              <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
                <div className="text-sm text-red-700 dark:text-red-400">
                  {addLinkMutation.error?.message ||
                    updateLinkMutation.error?.message ||
                    deleteLinkMutation.error?.message}
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}