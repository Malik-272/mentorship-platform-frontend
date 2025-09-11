import { ExternalLink } from "lucide-react"

export default function UserLinks({ user }) {
  if (!user.links || user.links.length === 0) return null

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <ExternalLink className="h-5 w-5" />
          Links
        </h3>
      </div>
      <div className="p-6">
        <div className="space-y-2">
          {user.links.map((link, index) => (
            <div key={index} className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">{link.name}:</span>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
              >
                {link.url}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}