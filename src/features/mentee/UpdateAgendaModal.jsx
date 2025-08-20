// import { useState } from "react"
// import { X, MessageSquare } from "lucide-react"

// const formatDateTime = (date, time) => {
//   const dateObj = new Date(`${date}T${time}`)
//   return dateObj.toLocaleDateString("en-US", {
//     weekday: "long",
//     month: "long",
//     day: "numeric",
//     year: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//     hour12: true,
//   })
// }

// export default function UpdateAgendaModal({ request, onConfirm, onCancel, isLoading }) {
//   const [agenda, setAgenda] = useState(request.agenda)
//   const [error, setError] = useState("")

//   const handleSubmit = (e) => {
//     e.preventDefault()

//     if (!agenda.trim()) {
//       setError("Please provide an agenda for your session")
//       return
//     }

//     if (agenda.trim().length < 10) {
//       setError("Please provide a more detailed agenda (at least 10 characters)")
//       return
//     }

//     if (agenda.trim().length > 500) {
//       setError("Agenda is too long (maximum 500 characters)")
//       return
//     }

//     setError("")
//     onConfirm(agenda.trim())
//   }

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//       <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full">
//         {/* Header */}
//         <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
//           <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Update Session Agenda</h2>
//           <button
//             onClick={onCancel}
//             className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
//           >
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         {/* Content */}
//         <form onSubmit={handleSubmit} className="p-6">
//           {/* Session Details */}
//           <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
//             <h4 className="font-medium text-gray-900 dark:text-white mb-2">Session Details:</h4>
//             <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
//               <div>
//                 <span className="font-medium">Mentor:</span> {request.mentorName}
//               </div>
//               <div>
//                 <span className="font-medium">Date & Time:</span> {formatDateTime(request.date, request.startTime)}
//               </div>
//             </div>
//           </div>

//           {/* Agenda Input */}
//           <div className="mb-6">
//             <label htmlFor="agenda" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//               <MessageSquare className="w-4 h-4 inline mr-1" />
//               Session Agenda
//             </label>
//             <textarea
//               id="agenda"
//               value={agenda}
//               onChange={(e) => {
//                 setAgenda(e.target.value)
//                 if (error) setError("")
//               }}
//               placeholder="Describe what you'd like to discuss in this session..."
//               rows={4}
//               className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
//               disabled={isLoading}
//             />
//             <div className="flex justify-between items-center mt-1">
//               <div className="text-xs text-gray-500">{agenda.length}/500 characters</div>
//               {error && <div className="text-xs text-red-600 dark:text-red-400">{error}</div>}
//             </div>
//           </div>

//           {/* Actions */}
//           <div className="flex items-center justify-end space-x-3">
//             <button
//               type="button"
//               onClick={onCancel}
//               disabled={isLoading}
//               className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={isLoading || !agenda.trim() || agenda.trim() === request.agenda}
//               className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
//             >
//               {isLoading ? "Updating..." : "Update Agenda"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }
"use client"

import { useState } from "react"
import { X, MessageSquare } from "lucide-react"

const formatDateTime = (date, time) => {
  const dateObj = new Date(`${date}T${time}`)
  return dateObj.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
}

export default function UpdateAgendaModal({ request, onConfirm, onCancel, isLoading }) {
  const [agenda, setAgenda] = useState(request.agenda)
  const [error, setError] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!agenda.trim()) {
      setError("Please provide an agenda for your session")
      return
    }

    if (agenda.trim().length < 10) {
      setError("Please provide a more detailed agenda (at least 10 characters)")
      return
    }

    if (agenda.trim().length > 500) {
      setError("Agenda is too long (maximum 500 characters)")
      return
    }

    setError("")
    onConfirm(agenda.trim())
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      {/* Header - Fixed at top */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Update Session Agenda</h2>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          {/* Session Details */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Session Details:</h4>
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <div>
                <span className="font-medium">Mentor:</span> {request.mentorName}
              </div>
              <div>
                <span className="font-medium">Date & Time:</span> {formatDateTime(request.date, request.startTime)}
              </div>
            </div>
          </div>

          {/* Agenda Input */}
          <div className="mb-6">
            <label htmlFor="agenda" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <MessageSquare className="w-4 h-4 inline mr-1" />
              Session Agenda
            </label>
            <textarea
              id="agenda"
              value={agenda}
              onChange={(e) => {
                setAgenda(e.target.value)
                if (error) setError("")
              }}
              placeholder="Describe what you'd like to discuss in this session..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              disabled={isLoading}
            />
            <div className="flex justify-between items-center mt-1">
              <div className="text-xs text-gray-500">{agenda.length}/500 characters</div>
              {error && <div className="text-xs text-red-600 dark:text-red-400">{error}</div>}
            </div>
          </div>
        </form>

        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading || !agenda.trim() || agenda.trim() === request.agenda}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {isLoading ? "Updating..." : "Update Agenda"}
          </button>
        </div>
      </div>
    </div>
  )
}
