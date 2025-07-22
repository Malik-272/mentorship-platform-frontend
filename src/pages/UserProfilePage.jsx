import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Settings,
  Flag,
  MapPin,
  Globe,
  Calendar,
  ExternalLink,
  Mail,
  UserIcon,
  Shield,
  Users,
  Clock,
  Tag,
} from "lucide-react";

import { useGetUserProfile } from "../hooks/useProfile";

import ReportUserModal from "./ReportUserModal";
import LoadingSpinner from "../ui/LoadingSpinner";
import ErrorMessage from "../ui/ErrorMessage";
import { useAuth } from "../context/AuthContext";
export default function UserProfilePage() {
  const { id } = useParams();
  const { data: currentUser } = useAuth();
  const [showReportModal, setShowReportModal] = useState(false);

  const { data: profileData, isLoading, error } = useGetUserProfile(id);

  const isOwnProfile = currentUser?.user?.id === id;

  if (isLoading) {
    return (
      // <ProtectedRoute requireAuth={true} requireVerification={true}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
      // </ProtectedRoute>
    );
  }

  if (error) {
    return (
      // <ProtectedRoute requireAuth={true} requireVerification={true}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <ErrorMessage
          title="Profile Not Found"
          message={
            error.message ||
            "The user profile you're looking for doesn't exist or has been removed."
          }
          showRetry={true}
          onRetry={() => window.location.reload()}
        />
      </div>
      // </ProtectedRoute>
    );
  }

  const user = profileData?.user;
  console.log("user:", user);

  return (
    // <ProtectedRoute requireAuth={true} requireVerification={true}>
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProfileHeader
          user={user}
          isOwnProfile={isOwnProfile}
          onReport={() => setShowReportModal(true)}
        />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ProfileInfo user={user} />
          </div>
          <div className="lg:col-span-1">
            <ProfileSidebar user={user} />
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <ReportUserModal
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
          reportedUser={user}
        />
      )}
    </div>
    // </ProtectedRoute>
  );
}

// Profile Header Component
function ProfileHeader({ user, isOwnProfile, onReport }) {
  const getInitials = (name) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "mentor":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "mentee":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "community_manager":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "admin":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case "community_manager":
        return "Community Manager";
      case "mentor":
        return "Mentor";
      case "mentee":
        return "Mentee";
      case "admin":
        return "Admin";
      default:
        return role;
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "mentor":
        return <Users className="w-4 h-4" />;
      case "mentee":
        return <UserIcon className="w-4 h-4" />;
      case "community_manager":
        return <Shield className="w-4 h-4" />;
      case "admin":
        return <Shield className="w-4 h-4" />;
      default:
        return <UserIcon className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Cover/Background */}
      <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600"></div>

      <div className="px-6 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-6">
          {/* Profile Picture */}
          <div className="relative -mt-16 mb-4 sm:mb-0">
            <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {user?.imageUrl ? (
                <img
                  src={user.imageUrl || "/placeholder.svg?height=128&width=128"}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                getInitials(user?.name)
              )}
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white truncate">
                  {user?.name}
                </h1>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  @{user?.id}
                </p>
                <p className="text-gray-700 dark:text-gray-200 mt-1">
                  {user?.headline}
                </p>

                <div className="flex items-center mt-3 space-x-3">
                  <span
                    className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${getRoleColor(
                      user?.role
                    )}`}
                  >
                    {getRoleIcon(user?.role)}
                    <span className="ml-1">{getRoleLabel(user?.role)}</span>
                  </span>

                  {user?.location && (
                    <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                      <MapPin className="w-4 h-4 mr-1" />
                      {user.location}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                {isOwnProfile ? (
                  <Link
                    to="/my/settings"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Link>
                ) : (
                  <button
                    onClick={onReport}
                    className="inline-flex items-center px-4 py-2 border border-red-300 dark:border-red-600 rounded-md shadow-sm text-sm font-medium text-red-700 dark:text-red-400 bg-white dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <Flag className="w-4 h-4 mr-2" />
                    Report User
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Profile Info Component
function ProfileInfo({ user }) {
  return (
    <div className="space-y-6">
      {/* About Section */}
      {user?.bio && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            About
          </h2>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
            {user.bio}
          </p>
        </div>
      )}

      {/* Skills Section */}
      {user?.skills && user.skills.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Tag className="w-5 h-5 mr-2" />
            Skills & Expertise
          </h2>
          <div className="flex flex-wrap gap-2">
            {user.skills.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Social Links Section */}
      {user?.links && user.links.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <ExternalLink className="w-5 h-5 mr-2" />
            Links & Social Media
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {user.links.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
              >
                <ExternalLink className="w-4 h-4 text-gray-400 mr-3 flex-shrink-0 group-hover:text-blue-500" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {link.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {link.url}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Profile Sidebar Component
function ProfileSidebar({ user }) {
  const getCountryName = (countryCode) => {
    // This would typically come from your countryCodes data
    const countries = {
      USA: "United States",
      CAN: "Canada",
      GBR: "United Kingdom",
      DEU: "Germany",
      FRA: "France",
      // Add more as needed
    };
    return countries[countryCode] || countryCode;
  };

  return (
    <div className="space-y-6">
      {/* Contact Info */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Contact Information
        </h3>
        <div className="space-y-3">
          <div className="flex items-center">
            <Mail className="w-4 h-4 text-gray-400 mr-3 flex-shrink-0" />
            <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
              {user?.email}
            </span>
          </div>

          {user?.country && (
            <div className="flex items-center">
              <Globe className="w-4 h-4 text-gray-400 mr-3 flex-shrink-0" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {getCountryName(user.country)}
              </span>
            </div>
          )}

          {user?.timezone && (
            <div className="flex items-center">
              <Clock className="w-4 h-4 text-gray-400 mr-3 flex-shrink-0" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {user.timezone}
              </span>
            </div>
          )}

          {user?.website && (
            <div className="flex items-center">
              <ExternalLink className="w-4 h-4 text-gray-400 mr-3 flex-shrink-0" />
              <a
                href={user.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 truncate"
              >
                {user.website}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Member Since */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Member Information
        </h3>
        <div className="space-y-3">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 text-gray-400 mr-3 flex-shrink-0" />
            <div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                Member since
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {user?.dateJoined
                  ? new Date(user.dateJoined).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Unknown"}
              </div>
            </div>
          </div>

          {user?.last_login && (
            <div className="flex items-center">
              <Clock className="w-4 h-4 text-gray-400 mr-3 flex-shrink-0" />
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  Last active
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(user.last_login).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats (if applicable for mentors) */}
      {user?.role === "mentor" && user?.stats && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Mentoring Stats
          </h3>
          <div className="space-y-3">
            {user.stats.totalSessions && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Total Sessions
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {user.stats.totalSessions}
                </span>
              </div>
            )}
            {user.stats.rating && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Rating
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  ⭐ {user.stats.rating}/5
                </span>
              </div>
            )}
            {user.stats.responseTime && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Response Time
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {user.stats.responseTime}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
