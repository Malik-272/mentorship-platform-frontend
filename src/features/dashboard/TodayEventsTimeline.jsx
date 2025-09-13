// import { useState, useEffect } from "react"
// import { Clock, ExternalLink } from "lucide-react"

// export default function TodayEventsTimeline({ events = [] }) {
//   const [currentTime, setCurrentTime] = useState(new Date())

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentTime(new Date())
//     }, 60000) // Update every minute

//     return () => clearInterval(timer)
//   }, [])

//   // Generate hours from 6 AM to 11 PM
//   const hours = Array.from({ length: 18 }, (_, i) => i + 6)

//   const getCurrentTimePosition = () => {
//     const now = currentTime
//     const currentHour = now.getHours()
//     const currentMinute = now.getMinutes()

//     if (currentHour < 6 || currentHour > 23) return null

//     const position = (currentHour - 6 + currentMinute / 60) * 40 // 40px per hour
//     return position
//   }

//   const getEventPosition = (event) => {
//     const [hours, minutes] = event.startTime.split(":").map(Number)
//     if (hours < 6 || hours > 23) return null

//     const startPosition = (hours - 6 + minutes / 60) * 40
//     const duration = event.duration / 60 // Convert minutes to hours
//     const height = duration * 40

//     return { top: startPosition, height }
//   }

//   const handleEventClick = (event) => {
//     if (event.meetLink) {
//       window.open(event.meetLink, "_blank")
//     }
//   }

//   const currentTimePosition = getCurrentTimePosition()

//   if (events.length === 0) {
//     return (
//       <div className="text-center py-8">
//         <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
//         <p className="text-sm text-gray-500 dark:text-gray-400">No events scheduled for today</p>
//       </div>
//     )
//   }

//   return (
//     <div className="relative">
//       {/* Timeline */}
//       <div className="relative h-96 overflow-y-auto">
//         <div className="absolute left-16 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700" />

//         {/* Hours */}
//         {hours.map((hour, index) => (
//           <div key={hour} className="relative flex items-center" style={{ height: "40px" }}>
//             <div className="w-14 text-xs text-gray-500 dark:text-gray-400 text-right pr-2">
//               {hour === 0 ? "12 AM" : hour === 12 ? "12 PM" : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
//             </div>
//             <div className="w-2 h-px bg-gray-200 dark:bg-gray-700" />
//           </div>
//         ))}

//         {/* Current Time Indicator */}
//         {currentTimePosition !== null && (
//           <div className="absolute left-0 right-0 flex items-center z-10" style={{ top: `${currentTimePosition}px` }}>
//             <div className="w-14 text-xs text-red-500 font-medium text-right pr-2">
//               {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
//             </div>
//             <div className="flex-1 h-px bg-red-500" />
//             <div className="w-2 h-2 bg-red-500 rounded-full -ml-1" />
//           </div>
//         )}

//         {/* Events */}
//         {events.map((event) => {
//           const position = getEventPosition(event)
//           if (!position) return null

//           return (
//             <div
//               key={event.id || `${event.startTime}-${event.mentorId || event.menteeId}`}
//               className="absolute left-18 right-4 bg-blue-100 dark:bg-blue-900 border border-blue-200 dark:border-blue-800 rounded-md p-2 cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
//               style={{
//                 top: `${position.top}px`,
//                 height: `${Math.max(position.height, 32)}px`,
//               }}
//               onClick={() => handleEventClick(event)}
//             >
//               <div className="flex items-center justify-between">
//                 <div className="flex-1 min-w-0">
//                   <p className="text-xs font-medium text-blue-900 dark:text-blue-100 truncate">
//                     {event.meetTitle || `Session with ${event.mentorId || event.menteeId}`}
//                   </p>
//                   <p className="text-xs text-blue-700 dark:text-blue-300">{event.duration} min</p>
//                   {event.communityName && (
//                     <p className="text-xs text-blue-600 dark:text-blue-400 truncate">via {event.communityName}</p>
//                   )}
//                 </div>
//                 {event.meetLink && (
//                   <ExternalLink className="h-3 w-3 text-blue-600 dark:text-blue-400 ml-1 flex-shrink-0" />
//                 )}
//               </div>
//             </div>
//           )
//         })}
//       </div>
//     </div>
//   )
// }
import { useState, useEffect } from "react"
import { Clock, ExternalLink } from "lucide-react"

export default function CompactEventCards({ events = [] }) {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(timer)
  }, [])

  if (events.length === 0) {
    return (
      <div className="text-center py-8 bg-white dark:bg-gray-950 rounded-lg">
        <Clock className="h-8 w-8 text-gray-400 dark:text-gray-600 mx-auto mb-2" />
        <p className="text-sm text-gray-500 dark:text-gray-400">No events scheduled for today</p>
      </div>
    )
  }

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":").map(Number)
    const date = new Date()
    date.setHours(hours, minutes)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="p-4 rounded-lg bg-white dark:bg-gray-900 shadow-md dark:shadow-none">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Today's Agenda</h2>
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>

      <div className="space-y-3">
        {events.map((event) => (
          <div
            key={event.id || `${event.startTime}-${event.mentorId || event.menteeId}`}
            className="relative flex items-center p-3 rounded-lg border-l-4 border-blue-500 dark:border-blue-400 bg-gray-50 dark:bg-gray-800 cursor-pointer hover:shadow-md transition-shadow dark:hover:bg-gray-700"
            onClick={() => { if (event.meetLink) window.open(event.meetLink, "_blank") }}
          >
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                {formatTime(event.startTime)} • {event.duration} min
              </p>
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate mt-1">
                {event.meetTitle || `Session with ${event.mentorId || event.menteeId}`}
              </h3>
            </div>
            {event.meetLink && (
              <ExternalLink className="h-4 w-4 text-blue-500 dark:text-blue-400 ml-2 flex-shrink-0" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}