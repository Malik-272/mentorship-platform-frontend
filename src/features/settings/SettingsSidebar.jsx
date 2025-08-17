import { NavLink } from "react-router-dom";
import { User, Shield, ExternalLink } from "lucide-react";

const navigationItems = [
  {
    id: "personal",
    name: "Personal Information",
    icon: User,
    description: "Update your profile and links",
  },
  {
    id: "security",
    name: "Security Settings",
    icon: Shield,
    description: "Password and 2FA settings",
  },
  {
    id: "connections",
    name: "App Connections",
    icon: ExternalLink,
    description: "Connect to third-party services",
  },
];

export default function SettingsSidebar() {
  return (
    <nav className="space-y-2">
      {navigationItems.map((item) => {
        const IconComponent = item.icon;

        return (
          <NavLink
            key={item.id}
            to={item.id} // 👈 relative route, e.g. /my/settings/personal
            className={({ isActive }) =>
              `w-full flex items-start p-4 rounded-lg text-left transition-colors ${isActive
                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 border border-transparent"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <IconComponent
                  className={`w-5 h-5 mt-0.5 mr-3 flex-shrink-0 ${isActive
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-400 dark:text-gray-500"
                    }`}
                />
                <div>
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {item.description}
                  </div>
                </div>
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}
