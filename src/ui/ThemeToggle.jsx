import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "../context/ThemeContext"

export default function ThemeToggle({ className = "" }) {
  const { theme, setTheme } = useTheme()

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      <button
        onClick={() => setTheme("light")}
        className={`p-2 rounded-md transition-colors ${theme === "light"
          ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400"
          : "text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800"
          }`}
        title="Light mode"
      >
        <Sun className="w-4 h-4" />
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={`p-2 rounded-md transition-colors ${theme === "dark"
          ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400"
          : "text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800"
          }`}
        title="Dark mode"
      >
        <Moon className="w-4 h-4" />
      </button>
      <button
        onClick={() => setTheme("system")}
        className={`p-2 rounded-md transition-colors ${theme === "system"
          ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400"
          : "text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800"
          }`}
        title="System mode"
      >
        <Monitor className="w-4 h-4" />
      </button>
    </div>
  )
}

// Simple toggle button (just light/dark)
export function SimpleThemeToggle({ className = "" }) {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-md transition-colors text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800 ${className}`}
      title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
    >
      {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
    </button>
  )
}
