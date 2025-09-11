import { CheckCircle, Ban } from "lucide-react"

export default function UserActions({ user, isUnbanning, isBanning, setShowUnbanModal, setShowBanModal }) {
  if (user.basicDetails.role === "ADMIN") return null

  return (
    <div className="flex justify-end gap-2">
      {user.basicDetails.isBanned ? (
        <button
          onClick={() => setShowUnbanModal(true)}
          className="inline-flex items-center px-4 py-2 border border-green-600 text-sm font-medium rounded-md text-green-600 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:bg-gray-800 dark:hover:bg-green-950"
          disabled={isUnbanning}
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          Unban User
        </button>
      ) : (
        <button
          onClick={() => setShowBanModal(true)}
          className="inline-flex items-center px-4 py-2 border border-red-600 text-sm font-medium rounded-md text-red-600 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:bg-gray-800 dark:hover:bg-red-950"
          disabled={isBanning}
        >
          <Ban className="h-4 w-4 mr-2" />
          Ban User
        </button>
      )}
    </div>
  )
}