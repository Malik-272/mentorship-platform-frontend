import { useNavigate } from "react-router-dom";
import { Building2, UserPlus, User, ExternalLink, CheckCircle, AlertCircle, Users, Calendar, Plus } from "lucide-react";

// A small utility component to keep the card structure clean
const DashboardCard = ({ title, icon: Icon, children, onClick, className = "", titleIconColor = "text-blue-500", showExternalLink = true }) => (
  <div
    className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 flex flex-col transition-transform duration-300 ease-in-out hover:scale-[1.01] ${onClick ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700" : ""} ${className}`}
    onClick={onClick}
  >
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center">
        <Icon className={`h-7 w-7 ${titleIconColor} mr-3`} />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
      </div>
      {onClick && showExternalLink && <ExternalLink className="h-4 w-4 text-gray-400" />}
    </div>
    {children}
  </div>
);

export default function CommunityManagerDashboard({ data }) {
  const navigate = useNavigate();

  // Use optional chaining to safely access nested properties
  const { community = null, joinRequests = [], profileSetup = {} } = data || {};
  const profileSteps = [
    { key: "hasImage", label: "Profile Image", completed: !!profileSetup?.imageUrl },
    { key: "hasBio", label: "Bio", completed: !!profileSetup?.bio },
    { key: "hasSkills", label: "Skills", completed: !!profileSetup?.skills },
    { key: "hasLinks", label: "Links", completed: profileSetup?.links?.length > 0 },
    { key: "hasCommunity", label: "Community Created", completed: community?.community },
  ];

  const completedSteps = profileSteps.filter((step) => step.completed).length;
  const isProfileComplete = completedSteps === profileSteps.length;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4 md:p-8 lg:p-12">
      {/* Your Community Menu */}
      <DashboardCard
        title="Your Community"
        icon={Building2}
        titleIconColor="text-blue-600"
        onClick={() => navigate("/communities/my")}
      >
        {community?.community ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
              {community.community.imageUrl ? (
                <img
                  src={community.community.imageUrl || "/placeholder.svg"}
                  alt={community.community.name}
                  className="h-12 w-12 rounded-lg object-cover shadow-sm"
                />
              ) : (
                <div className="h-12 w-12 rounded-lg bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-gray-500">
                  <Building2 className="h-6 w-6" />
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{community.community.name}</h4>
                  {community.community.verified && <CheckCircle className="h-4 w-4 text-blue-500 ml-2" />}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">@{community.community.id}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-col items-center">
                <div className="flex items-center text-gray-800 dark:text-gray-200">
                  <Users className="h-5 w-5 mr-1" />
                  <span className="text-lg font-bold">{community.community.memberCount || 0}</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Members</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center text-gray-800 dark:text-gray-200">
                  <Calendar className="h-5 w-5 mr-1" />
                  <span className="text-lg font-bold">{new Date(community.community.createdAt).getFullYear()}</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Created</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              You haven't created a community yet. Start building your community today!
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate("/communities/create");
              }}
              className="inline-flex items-center px-6 py-2.5 rounded-full shadow-md text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Community
            </button>
          </div>
        )}
      </DashboardCard>

      {/* Join Requests Menu */}
      <DashboardCard
        title="Join Requests"
        icon={UserPlus}
        titleIconColor="text-green-600"
        onClick={() => navigate("/communities/my/manage")}
      >
        {joinRequests?.joinRequests.length > 0 ? (
          <div className="space-y-4">
            {joinRequests?.joinRequests.slice(0, 5).map((request) => (
              <div key={request.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                <div className="flex items-center space-x-4">
                  {request?.user?.imageUrl ? (
                    <img
                      src={request?.user?.imageUrl || "/placeholder.svg"}
                      alt={request?.user?.name}
                      className="h-10 w-10 rounded-full object-cover shadow-sm"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-gray-500 font-bold text-lg">
                      {request?.user?.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{request?.user?.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">@{request?.userId}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                  {new Date(request?.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
            {joinRequests?.joinRequests.length > 5 && (
              <p className="text-sm text-center text-gray-500 dark:text-gray-400 mt-4">+{joinRequests?.joinRequests.length - 5} more</p>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400 py-6">
            No pending join requests at the moment.
          </p>
        )}
      </DashboardCard>

      {/* Profile Setup Menu */}
      <DashboardCard
        title="Profile Setup"
        icon={User}
        titleIconColor="text-purple-600"
        className="md:col-span-2 lg:col-span-1"
        showExternalLink={false}
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
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">You're all set to manage your community.</p>
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
                  Complete Your Profile
                </button>
              </div>
            </div>
          )}
        </div>
      </DashboardCard>
    </div>
  );
}