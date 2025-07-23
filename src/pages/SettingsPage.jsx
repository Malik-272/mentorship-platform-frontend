import { useState } from "react"
import { useAuth } from "../context/AuthContext"
// import ProtectedRoute from "../ui/ProtectedRoute"
import SettingsSidebar from "../features/settings/SettingsSidebar"
import PersonalInfoSection from "../features/settings/PersonalInfoSection"
import SecuritySection from "../features/settings/SecuritySection"
import { useGetUserProfile } from "../hooks/useProfile"

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("personal")
  const { data: userData } = useAuth()
  const { data } = useGetUserProfile(userData?.user?.id)
  // console.log(isLoading, data)

  const renderContent = () => {
    switch (activeSection) {
      case "personal":
        return <PersonalInfoSection />
      case "security":
        return <SecuritySection user={data?.user} />
      default:
        return <PersonalInfoSection />
    }
  }

  return (
    // <ProtectedRoute requireAuth={true} requireVerification={true} requiredRole={["mentee", "mentor"]}>
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Account Settings</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Manage your account information, security settings, and preferences.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <SettingsSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}
