import { X, Mail, FileText, CheckCircle, AlertCircle } from "lucide-react"

const VERIFICATION_STEPS = [
  {
    step: 1,
    title: "Send Verification Email",
    icon: Mail,
    description: "Send an email to sgrowthly@gmail.com with the following information:",
    details: [
      "Community name and description",
      "Organization/school that backs your community",
      "Official documentation proving your affiliation",
      "Your role and position in the organization",
      "Contact information for verification",
    ],
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-900/20",
  },
  {
    step: 2,
    title: "Provide Additional Information",
    icon: FileText,
    description: "If further verification is needed, we'll reply with specific requests:",
    details: [
      "Additional documentation may be requested",
      "Verification of your identity and role",
      "Proof of community legitimacy",
      "Official endorsement from your organization",
    ],
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-100 dark:bg-orange-900/20",
  },
  {
    step: 3,
    title: "Verification Decision",
    icon: CheckCircle,
    description: "You'll receive a final decision via email:",
    details: [
      "✅ Approval: Your community gets verified status",
      "❌ Rejection: Detailed explanation of the reason",
      "🔄 Additional requirements: More information needed",
    ],
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-100 dark:bg-green-900/20",
  },
]

export default function VerificationHelpModal({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="inline-block w-full max-w-3xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-lg">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full mr-3">
                <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Community Verification Process</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Follow these steps to get your community verified
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Important Notice */}
          <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                  Verification Requirements
                </h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Only communities backed by legitimate organizations, schools, or institutions can be verified.
                  Personal or informal communities are not eligible for verification.
                </p>
              </div>
            </div>
          </div>

          {/* Verification Steps */}
          <div className="space-y-6">
            {VERIFICATION_STEPS.map((step, index) => {
              const IconComponent = step.icon
              return (
                <div key={step.step} className="relative">
                  {/* Connector Line */}
                  {index < VERIFICATION_STEPS.length - 1 && (
                    <div className="absolute left-5 top-12 w-0.5 h-16 bg-gray-200 dark:bg-gray-600"></div>
                  )}

                  <div className="flex items-start">
                    {/* Step Icon */}
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full ${step.bgColor} mr-4 flex-shrink-0`}
                    >
                      <IconComponent className={`w-5 h-5 ${step.color}`} />
                    </div>

                    {/* Step Content */}
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mr-2">
                          Step {step.step}
                        </span>
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white">{step.title}</h4>
                      </div>

                      <p className="text-gray-600 dark:text-gray-300 mb-3">{step.description}</p>

                      <ul className="space-y-1">
                        {step.details.map((detail, detailIndex) => (
                          <li key={detailIndex} className="flex items-start text-sm text-gray-600 dark:text-gray-400">
                            <span className="text-gray-400 mr-2 mt-1">•</span>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Contact Information */}
          <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Contact Information</h4>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <Mail className="w-4 h-4 mr-2" />
              <a
                href="mailto:sgrowthly@gmail.com"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors"
              >
                sgrowthly@gmail.com
              </a>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Please allow 3-5 business days for initial review. Complex verifications may take longer.
            </p>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
            >
              Got it, thanks!
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
