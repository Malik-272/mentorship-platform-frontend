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