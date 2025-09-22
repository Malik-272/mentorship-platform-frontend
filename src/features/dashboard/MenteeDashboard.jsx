import { useNavigate } from "react-router-dom";
import { Users, Calendar, User, Clock, ExternalLink, CheckCircle, AlertCircle, Building2 } from "lucide-react";
import TodayEventsTimeline from "./TodayEventsTimeline";

// A small utility component to keep the card structure clean
const DashboardCard = ({ title, icon: Icon, children, onClick, className = "", titleIconColor = "text-blue-500" }) => (
  <div
    className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 flex flex-col transition-transform duration-300 ease-in-out hover:scale-[1.01] ${onClick ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700" : ""} ${className}`}
    onClick={onClick}
  >
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center">
        <Icon className={`h-7 w-7 ${titleIconColor} mr-3`} />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
      </div>
      {onClick && <ExternalLink className="h-4 w-4 text-gray-400" />}
    </div>
    {children}
  </div>
);

export default function MenteeDashboard({ data }) {
  const navigate = useNavigate();
  const { communities = [], sessionRequests = [], userData = {}, todayEvents = [] } = data || {};
  const profileSetup = userData?.user;
  const profileSteps = [
    { key: "hasImage", label: "Profile Image", completed: !!profileSetup?.imageUrl },
    { key: "hasBio", label: "Bio", completed: !!profileSetup?.bio },
    { key: "hasSkills", label: "Skills", completed: !!profileSetup?.skills },
    { key: "hasLinks", label: "Links", completed: profileSetup?.links?.length > 0 },
  ];

  const completedSteps = profileSteps.filter((step) => step.completed).length;
  const isProfileComplete = completedSteps === profileSteps.length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4 md:p-8 lg:p-12">
      {/* Communities Menu */}
      <DashboardCard
        title="My Communities"
        icon={Users}
        titleIconColor="text-blue-600"
        onClick={() => navigate("/my/communities")}
      >
        {communities.length > 0 ? (
          <div className="space-y-4">
            {communities.slice(0, 3).map((community) => (
              <div key={community.communityId} className="flex items-center space-x-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                {community.imageUrl ? (
                  <img
                    src={community.imageUrl || "/placeholder.svg"}
                    alt={community.name}
                    className="h-10 w-10 rounded-full object-cover shadow-sm"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-gray-500">
                    <Building2 className="h-5 w-5" />
                  </div>
                )}
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{community.name}</span>
              </div>
            ))}
            {communities.length > 3 && (
              <p className="text-sm text-center text-gray-500 dark:text-gray-400">+{communities.length - 3} more</p>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400 py-6">
            Search for communities that align with your interests to find mentors and resources.
          </p>
        )}
      </DashboardCard>

      {/* Session Requests Menu */}
      <DashboardCard
        title="Session Requests"
        icon={Calendar}
        titleIconColor="text-green-600"
        onClick={() => navigate("/my/session-requests")}
      >
        {sessionRequests.length > 0 ? (
          <div className="space-y-4">
            {sessionRequests.slice(0, 5).map((request) => (
              <div key={request.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">@{request.mentorId}</span>
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full font-medium ${request.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        : request.status === "ACCEPTED"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : request.status === "REJECTED"
                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                        }`}
                    >
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1).toLowerCase()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {request.date} at {request.startTime} • {request.duration} min
                  </p>
                </div>
              </div>
            ))}
            {sessionRequests.length > 5 && (
              <p className="text-sm text-center text-gray-500 dark:text-gray-400">+{sessionRequests.length - 5} more</p>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400 py-6">
            No session requests yet. Find a mentor in your communities to get started!
          </p>
        )}
      </DashboardCard>

      {/* Profile Setup Menu */}
      <DashboardCard
        title="Profile Setup"
        icon={User}
        titleIconColor="text-purple-600"
        className="row-span-2"
      >
        <div className="flex flex-col h-full">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {completedSteps} of {profileSteps.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div
                className="bg-purple-500 h-2.5 rounded-full transition-all duration-500 ease-in-out"
                style={{ width: `${(completedSteps / profileSteps.length) * 100}%` }}
              />
            </div>
          </div>

          {isProfileComplete ? (
            <div className="flex flex-col items-center justify-center text-center flex-grow py-8 bg-green-50 dark:bg-green-900/30 rounded-lg">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400 mb-2" />
              <span className="text-base font-medium text-green-700 dark:text-green-400">
                Your profile is complete!
              </span>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">You're all set to start connecting.</p>
            </div>
          ) : (
            <div className="space-y-3 flex-grow">
              {profileSteps.map((step) => (
                <div key={step.key} className="flex items-center">
                  {step.completed ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />
                  )}
                  <span
                    className={`text-base font-medium ${step.completed ? "text-gray-700 dark:text-gray-300 line-through" : "text-gray-800 dark:text-gray-200"
                      }`}
                  >
                    {step.label}
                  </span>
                </div>
              ))}
              <div className="mt-auto pt-6">
                <button
                  onClick={() => navigate("/settings")}
                  className="w-full px-4 py-2.5 rounded-full text-sm font-semibold bg-purple-600 text-white shadow-md hover:bg-purple-700 transition-colors dark:bg-purple-500 dark:hover:bg-purple-600"
                >
                  Complete your profile
                </button>
              </div>
            </div>
          )}
        </div>
      </DashboardCard>

      {/* Today's Events Menu */}
      <DashboardCard
        title="Today's Events"
        icon={Clock}
        titleIconColor="text-orange-600"
        className="row-span-2"
      >
        <div className="h-full flex flex-col">
          <TodayEventsTimeline events={todayEvents} />
        </div>
      </DashboardCard>
    </div>
  );
}