import { AlertTriangle, CheckCircle, Clock, XCircle } from "lucide-react"

export const formatDateTime = (date, time) => {
  const dateObj = new Date(`${date}T${time}`)
  return {
    date: dateObj.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    time: dateObj.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),
  }
}

export const formatDuration = (minutes) => {
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

export const formatDateTimeForCancelConfirmationModel = (date, time) => {
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
