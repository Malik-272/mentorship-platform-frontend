import { useNavigate } from "react-router-dom";
import { Briefcase, Users, User, Clock, ExternalLink, CheckCircle, AlertCircle, Plus, Building2 } from "lucide-react";
import TodayEventsTimeline from "./TodayEventsTimeline";

// A small utility component to keep the card structure clean
const DashboardCard = ({ title, icon: Icon, children, onClick, className = "", titleClassName = "", titleIconColor = "text-blue-500" }) => (
  <div
    className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 flex flex-col transition-transform duration-300 ease-in-out hover:scale-[1.01] ${onClick ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700" : ""} ${className}`}
    onClick={onClick}
  >
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center">
        <Icon className={`h-7 w-7 ${titleIconColor} mr-3`} />
        <h3 className={`text-xl font-bold text-gray-900 dark:text-white ${titleClassName}`}>{title}</h3>
      </div>
      {onClick && <ExternalLink className="h-4 w-4 text-gray-400" />}
    </div>
    {children}
  </div>
);

export default function MentorDashboard({ data }) {
  const navigate = useNavigate();
  const { communities = [], userData = {}, todayEvents = [] } = data || {};
  const profileSetup = userData?.user;
  const services = profileSetup?.services || [];
  const profileSteps = [
    { key: "hasImage", label: "Profile Image", completed: !!profileSetup?.imageUrl },
    { key: "hasBio", label: "Bio", completed: !!profileSetup?.bio },
    { key: "hasSkills", label: "Skills", completed: !!profileSetup?.skills },
    { key: "hasLinks", label: "Links", completed: profileSetup?.links?.length > 0 },
    { key: "hasService", label: "At least 1 Service", completed: services.length > 0 },
  ];

  const completedSteps = profileSteps.filter((step) => step.completed).length;
  const isProfileComplete = completedSteps === profileSteps.length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4 md:p-8 lg:p-12">
      {/* Services Menu */}
      <DashboardCard
        title="My Services"
        icon={Briefcase}
        titleIconColor="text-blue-600"
        onClick={() => navigate("/my/services")}
      >
        {services.length > 0 ? (
          <div className="space-y-4">
            {services.slice(0, 3).map((service) => (
              <div key={service.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate max-w-[150px]">{service.type}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{service.sessionTime} minutes</p>
                </div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {service.acceptedRequestsCount || 0} sessions
                </span>
              </div>
            ))}
            {services.length > 3 && (
              <p className="text-sm text-center text-gray-500 dark:text-gray-400">+{services.length - 3} more</p>
            )}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              You haven't created any services yet.
            </p>
          </div>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate("/my/services/new");
          }}
          className="mt-6 w-full flex items-center justify-center px-4 py-2.5 rounded-full text-sm font-semibold bg-blue-600 text-white shadow-md hover:bg-blue-700 transition-colors dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New Service
        </button>
      </DashboardCard>

      {/* Communities Menu */}
      <DashboardCard
        title="My Communities"
        icon={Users}
        titleIconColor="text-green-600"
        onClick={() => navigate("/my/communities")}
      >
        {communities.length > 0 ? (
          <div className="space-y-4">
            {communities.slice(0, 3).map((community) => (
              <div key={community.communityId} className="flex items-center space-x-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                {community.imageUrl ? (
                  <img
                    src={community.imageUrl}
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
            Search for communities that align with your expertise to expand your reach and connect with more people.
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
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">You're all set to start mentoring.</p>
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