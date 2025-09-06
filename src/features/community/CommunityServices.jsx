import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Clock, User, ChevronDown, ChevronUp, Edit, Eye } from "lucide-react";

export default function CommunityServices({ services, isLoading, error, communityId }) {
  const [expandedMentor, setExpandedMentor] = useState(null);
  const navigate = useNavigate();
  const { data: currentUser } = useAuth();
  const user = currentUser?.user;

  const handleServiceClick = (service, mentorId) => {
    // If user is the mentor who owns this service, go to management page
    if (user?.id === mentorId && user?.role === "MENTOR") {
      navigate(`/my/services/${service.id}`);
    }
    // If user is a mentee, go to booking page with community ID
    else if (user?.role === "MENTEE") {
      navigate(`/users/${mentorId}/services/${service.id}/book`);
    }
    // For mentors who don't own the service, do nothing (disabled)
  };

  const isServiceOwner = (mentorId) => {
    return user?.id === mentorId && user?.role === "MENTOR";
  };

  const canInteractWithService = (mentorId) => {
    if (user?.role === "MENTEE") return true;
    if (user?.role === "MENTOR" && user?.id === mentorId) return true;
    return false;
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Available Services
        </h3>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Available Services
        </h3>
        <div className="text-red-500 text-sm">
          Failed to load services: {error.message}
        </div>
      </div>
    );
  }

  if (!services || Object.keys(services).length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Available Services
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          No services available in this community yet.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Available Services
      </h3>

      <div className="space-y-4">
        {Object.entries(services).map(([mentorId, mentorServices]) => (
          <div key={mentorId} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <button
              onClick={() => setExpandedMentor(expandedMentor === mentorId ? null : mentorId)}
              className="w-full flex items-center justify-between text-left"
            >
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-400" />
                <span className="font-medium text-gray-900 dark:text-white">
                  {isServiceOwner(mentorId) ? "My Services" : "Mentor Services"}
                </span>
                {!isServiceOwner(mentorId) && user?.role === "MENTOR" && (
                  <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                    View only
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {mentorServices.length} service{mentorServices.length !== 1 ? 's' : ''}
                </span>
                {expandedMentor === mentorId ? (
                  <ChevronUp className="h-4 w-4 text-gray-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                )}
              </div>
            </button>

            {expandedMentor === mentorId && (
              <div className="mt-3 space-y-3">
                {mentorServices.map((service) => {
                  const isOwner = isServiceOwner(mentorId);
                  const canInteract = canInteractWithService(mentorId);

                  return (
                    <div
                      key={service.id}
                      onClick={() => canInteract && handleServiceClick(service, mentorId)}
                      className={`
                        rounded-lg p-3 transition-colors
                        ${canInteract
                          ? 'bg-gray-50 dark:bg-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600'
                          : 'bg-gray-100 dark:bg-gray-800 cursor-default opacity-75'
                        }
                        ${isOwner ? 'border-l-4 border-blue-500' : ''}
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {service.type}
                        </h4>
                        {isOwner ? (
                          <Edit className="h-4 w-4 text-blue-500" />
                        ) : user?.role === "MENTOR" ? (
                          <Eye className="h-4 w-4 text-gray-400" />
                        ) : null}
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                        <Clock className="h-4 w-4" />
                        <span>{service.sessionTime} minutes</span>
                      </div>
                      <div className="text-xs text-gray-400 mt-2">
                        {isOwner
                          ? "Click to manage this service"
                          : user?.role === "MENTEE"
                            ? "Click to book this service"
                            : "View only - Other mentor's service"
                        }
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Informational note for mentors */}
      {user?.role === "MENTOR" && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-xs text-blue-700 dark:text-blue-300">
            <strong>Note:</strong> As a mentor, you can only manage your own services.
            Other mentors' services are shown for reference only.
          </p>
        </div>
      )}
    </div>
  );
}