import { AlertCircle, RefreshCw } from "lucide-react"

export default function ErrorMessage({
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again.",
  showRetry = false,
  onRetry,
  className = "",
}) {
  return (
    <div className={`text-center ${className}`}>
      <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
        <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
      </div>

      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{title}</h3>

      <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">{message}</p>

      {showRetry && onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </button>
      )}
    </div>
  )
}
