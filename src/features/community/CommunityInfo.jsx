import { ExternalLink } from "lucide-react"

export default function CommunityInfo({ community }) {
  return (
    <div className="space-y-6">
      {/* Description */}
      {community?.description && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">About</h2>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
            {community.description}
          </p>
        </div>
      )}

      {/* Community Guidelines */}
      {community?.guidelines && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Community Guidelines</h2>
          <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
            {community.guidelines}
          </div>
        </div>
      )}

      {/* Links */}
      {community?.links && community.links.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <ExternalLink className="w-5 h-5 mr-2" />
            Links & Resources
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {community.links.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
              >
                <ExternalLink className="w-4 h-4 text-gray-400 mr-3 flex-shrink-0 group-hover:text-blue-500" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 dark:text-white truncate">{link.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{link.url}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}