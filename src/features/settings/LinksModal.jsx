// import { useState } from "react"
// import { useForm, useFieldArray } from "react-hook-form"
// import { X, Plus, Trash2, ExternalLink } from "lucide-react"
// import { useUpdateLinks } from "../../hooks/useSettings"

// export default function LinksModal({ isOpen, onClose, userLinks }) {
//   const [isSubmitting, setIsSubmitting] = useState(false)

//   const {
//     control,
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({
//     defaultValues: {
//       links: userLinks.length > 0 ? userLinks : [{ linkName: "", linkUrl: "" }],
//     },
//   })

//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: "links",
//   })

//   const updateLinksMutation = useUpdateLinks()

//   const onSubmit = async (data) => {
//     setIsSubmitting(true)
//     try {
//       // Filter out empty links
//       const validLinks = data.links.filter((link) => link.name.trim() && link.url.trim())
//       await updateLinksMutation.mutateAsync(validLinks)
//       onClose()
//     } catch (error) {
//       console.error("Links update failed:", error)
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   if (!isOpen) return null

//   return (
//     <div className="fixed inset-0 z-50 overflow-y-auto">
//       <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
//         {/* Background overlay */}
//         <div
//           className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75"
//           onClick={onClose}
//         />

//         {/* Modal */}
//         <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-lg">
//           {/* Header */}
//           <div className="flex items-center justify-between mb-6">
//             <div>
//               <h3 className="text-lg font-medium text-gray-900 dark:text-white">Manage Social Links</h3>
//               <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
//                 Add or edit your social media profiles and portfolio links
//               </p>
//             </div>
//             <button
//               onClick={onClose}
//               className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
//             >
//               <X className="w-5 h-5" />
//             </button>
//           </div>

//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//             {/* Links List */}
//             <div className="space-y-4 max-h-96 overflow-y-auto">
//               {fields.map((field, index) => (
//                 <div
//                   key={field.id}
//                   className="flex items-start space-x-3 p-4 border border-gray-200 dark:border-gray-600 rounded-lg"
//                 >
//                   <ExternalLink className="w-5 h-5 text-gray-400 mt-2 flex-shrink-0" />

//                   <div className="flex-1 space-y-3">
//                     <div>
//                       <input
//                         {...register(`links.${index}.name`, {
//                           required: "Link name is required",
//                         })}
//                         placeholder="Link name (e.g., LinkedIn, GitHub)"
//                         className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
//                       />
//                       {errors.links?.[index]?.name && (
//                         <p className="mt-1 text-sm text-red-600 dark:text-red-400">
//                           {errors.links[index].name.message}
//                         </p>
//                       )}
//                     </div>

//                     <div>
//                       <input
//                         {...register(`links.${index}.url`, {
//                           required: "URL is required",
//                           pattern: {
//                             value: /^https?:\/\/.+/,
//                             message: "Please enter a valid URL starting with http:// or https://",
//                           },
//                         })}
//                         placeholder="https://example.com"
//                         className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
//                       />
//                       {errors.links?.[index]?.url && (
//                         <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.links[index].url.message}</p>
//                       )}
//                     </div>
//                   </div>

//                   <button
//                     type="button"
//                     onClick={() => remove(index)}
//                     className="p-2 text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors"
//                     disabled={fields.length === 1}
//                   >
//                     <Trash2 className="w-4 h-4" />
//                   </button>
//                 </div>
//               ))}
//             </div>

//             {/* Add Link Button */}
//             <button
//               type="button"
//               onClick={() => append({ name: "", url: "" })}
//               className="w-full flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
//             >
//               <Plus className="w-5 h-5 mr-2" />
//               Add Another Link
//             </button>

//             {/* Action Buttons */}
//             <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
//               <button
//                 type="button"
//                 onClick={onClose}
//                 className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 disabled={isSubmitting || updateLinksMutation.isPending}
//                 className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-md transition-colors disabled:cursor-not-allowed"
//               >
//                 {isSubmitting || updateLinksMutation.isPending ? "Saving..." : "Save Links"}
//               </button>
//             </div>

//             {/* Error Message */}
//             {updateLinksMutation.error && (
//               <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
//                 <div className="text-sm text-red-700 dark:text-red-400">{updateLinksMutation.error.message}</div>
//               </div>
//             )}
//           </form>
//         </div>
//       </div>
//     </div>
//   )
// }

import { useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { X, Plus, Trash2, ExternalLink } from "lucide-react"
import { useUpdateLinks } from "../../hooks/useSettings"

export default function LinksModal({ isOpen, onClose, userLinks }) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      links: userLinks.length > 0 ? userLinks : [{ linkName: "", linkUrl: "" }], // Changed from name/url to linkName/linkUrl
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "links",
  })

  const updateLinksMutation = useUpdateLinks()

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      // Filter out empty links
      const validLinks = data.links.filter((link) => link.linkName.trim() && link.linkUrl.trim()) // Changed to linkName/linkUrl
      await updateLinksMutation.mutateAsync(validLinks)
      onClose()
    } catch (error) {
      console.error("Links update failed:", error)
    } finally {
      setIsSubmitting(false)
    }
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
                        {...register(`links.${index}.linkName`, { // Changed from name to linkName
                          required: "Link name is required",
                        })}
                        placeholder="Link name (e.g., LinkedIn, GitHub)"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                      {errors.links?.[index]?.linkName && ( // Changed from name to linkName
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {errors.links[index].linkName.message} // Changed from name to linkName
                        </p>
                      )}
                    </div>

                    <div>
                      <input
                        {...register(`links.${index}.linkUrl`, { // Changed from url to linkUrl
                          required: "URL is required",
                          pattern: {
                            value: /^https?:\/\/.+/,
                            message: "Please enter a valid URL starting with http:// or https://",
                          },
                        })}
                        placeholder="https://example.com"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                      {errors.links?.[index]?.linkUrl && ( // Changed from url to linkUrl
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {errors.links[index].linkUrl.message} // Changed from url to linkUrl
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="p-2 text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors"
                    disabled={fields.length === 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Link Button */}
            <button
              type="button"
              onClick={() => append({ linkName: "", linkUrl: "" })} // Changed from name/url to linkName/linkUrl
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
                disabled={isSubmitting || updateLinksMutation.isPending}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-md transition-colors disabled:cursor-not-allowed"
              >
                {isSubmitting || updateLinksMutation.isPending ? "Saving..." : "Save Links"}
              </button>
            </div>

            {/* Error Message */}
            {updateLinksMutation.error && (
              <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
                <div className="text-sm text-red-700 dark:text-red-400">{updateLinksMutation.error.message}</div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}