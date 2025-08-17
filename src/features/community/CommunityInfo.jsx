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
    </div>
  )
}