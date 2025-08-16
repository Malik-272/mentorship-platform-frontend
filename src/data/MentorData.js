import { Ban, Check, Clock, X } from "lucide-react";

export const STATUS_CONFIG = {
  PENDING: {
    title: "Pending Requests",
    color: "orange",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
    borderColor: "border-orange-200 dark:border-orange-800",
    textColor: "text-orange-700 dark:text-orange-300",
    icon: Clock,
  },
  ACCEPTED: {
    title: "Accepted Sessions",
    color: "green",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    borderColor: "border-green-200 dark:border-green-800",
    textColor: "text-green-700 dark:text-green-300",
    icon: Check,
  },
  REJECTED: {
    title: "Rejected Requests",
    color: "red",
    bgColor: "bg-red-50 dark:bg-red-900/20",
    borderColor: "border-red-200 dark:border-red-800",
    textColor: "text-red-700 dark:text-red-300",
    icon: X,
  },
  CANCELLED: {
    title: "Canceled Sessions",
    color: "gray",
    bgColor: "bg-gray-50 dark:bg-gray-900/20",
    borderColor: "border-gray-200 dark:border-gray-800",
    textColor: "text-gray-700 dark:text-gray-300",
    icon: Ban,
  },
}

export const COMMON_REASONS = [
  "Personal emergency",
  "Schedule conflict",
  "Technical issues",
  "Health reasons",
  "Family emergency",
  "Other",
]
