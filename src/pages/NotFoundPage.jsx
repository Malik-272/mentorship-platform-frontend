import { Link } from "react-router-dom"
import { Home, ArrowLeft, Search, Users, Calendar } from "lucide-react"
import { useAuth } from "../hooks/useAuth"

export default function NotFoundPage() {
  const { isAuthenticated, user } = useAuth()

  const suggestions = [
    {
      icon: Home,
      title: "Go Home",
      description: "Return to the main page",
      link: "/",
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900",
    },
    {
      icon: Users,
      title: "Browse Mentors",
      description: "Find experienced mentors",
      link: "/mentors",
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900",
    },
    {
      icon: Calendar,
      title: "How It Works",
      description: "Learn about our platform",
      link: "/how-it-works",
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-100 dark:bg-purple-900",
    },
  ]

  // Add authenticated user suggestions
  if (isAuthenticated) {
    suggestions.unshift({
      icon: Search,
      title: "Dashboard",
      description: "Go to your dashboard",
      link: "/dashboard",
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-100 dark:bg-orange-900",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white dark:bg-gray-800 py-12 px-4 shadow-lg sm:rounded-lg sm:px-10 text-center transition-colors">
          {/* 404 Illustration */}
          <div className="mb-8">
            <div className="mx-auto w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-full flex items-center justify-center mb-6">
              <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                404
              </div>
            </div>

            {/* Animated illustration */}
            <div className="relative mx-auto w-48 h-32 mb-6">
              <svg className="w-full h-full" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Lost person */}
                <g className="animate-bounce">
                  <circle cx="100" cy="40" r="12" fill="currentColor" className="text-gray-400 dark:text-gray-500" />
                  <rect
                    x="94"
                    y="52"
                    width="12"
                    height="20"
                    rx="6"
                    fill="currentColor"
                    className="text-gray-400 dark:text-gray-500"
                  />
                  <rect
                    x="88"
                    y="58"
                    width="8"
                    height="2"
                    rx="1"
                    fill="currentColor"
                    className="text-gray-300 dark:text-gray-600"
                  />
                  <rect
                    x="104"
                    y="58"
                    width="8"
                    height="2"
                    rx="1"
                    fill="currentColor"
                    className="text-gray-300 dark:text-gray-600"
                  />
                  <rect
                    x="96"
                    y="72"
                    width="3"
                    height="12"
                    rx="1.5"
                    fill="currentColor"
                    className="text-gray-400 dark:text-gray-500"
                  />
                  <rect
                    x="101"
                    y="72"
                    width="3"
                    height="12"
                    rx="1.5"
                    fill="currentColor"
                    className="text-gray-400 dark:text-gray-500"
                  />
                </g>

                {/* Question marks */}
                <text x="70" y="30" className="text-lg fill-current text-blue-500 dark:text-blue-400 animate-pulse">
                  ?
                </text>
                <text
                  x="130"
                  y="25"
                  className="text-xl fill-current text-purple-500 dark:text-purple-400 animate-pulse"
                  style={{ animationDelay: "0.5s" }}
                >
                  ?
                </text>
                <text
                  x="85"
                  y="100"
                  className="text-lg fill-current text-green-500 dark:text-green-400 animate-pulse"
                  style={{ animationDelay: "1s" }}
                >
                  ?
                </text>

                {/* Path lines */}
                <path
                  d="M20 100 Q50 80 80 100 T140 100 Q170 80 180 100"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="5,5"
                  className="text-gray-300 dark:text-gray-600"
                />
              </svg>
            </div>
          </div>

          {/* Content */}
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Oops! Page Not Found</h1>

          <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
            The page you're looking for seems to have wandered off.
          </p>

          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
            Don't worry, even the best mentors sometimes take wrong turns!
          </p>

          {/* User-specific message */}
          {isAuthenticated && user && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-8">
              <p className="text-blue-800 dark:text-blue-200 text-sm">
                Welcome back, <span className="font-medium">{user.name}</span>! Let's get you back on track to your
                mentorship journey.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-4 mb-8">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
              >
                <Home className="w-5 h-5 mr-2" />
                Go Home
              </Link>

              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Go Back
              </button>
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Still can't find what you're looking for?</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 text-sm font-medium transition-colors"
              >
                Contact Support
              </Link>
              <span className="hidden sm:inline text-gray-300 dark:text-gray-600">•</span>
              <Link
                to="/help"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 text-sm font-medium transition-colors"
              >
                Help Center
              </Link>
              <span className="hidden sm:inline text-gray-300 dark:text-gray-600">•</span>
              <Link
                to="/about"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 text-sm font-medium transition-colors"
              >
                About Growtly
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
