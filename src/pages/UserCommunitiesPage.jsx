import { useState } from "react";
import { Users, Clock, LogOut, Loader2, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  useMemberships,
  useJoinRequests,
  useLeaveCommunity,
  useCancelRequestToJoin,
} from "../hooks/useCommunities";

export default function UserCommunitiesPage() {
  const [actionError, setActionError] = useState(null);
  const navigate = useNavigate();

  const { data: memberships = [], isLoading: loadingMemberships, error: membershipError } = useMemberships();
  const { data: joinRequests = [] } = useJoinRequests();

  const { mutate: leaveCommunity, isPending: isLeaving, error: leaveError } = useLeaveCommunity();
  const { mutate: cancelRequest, isPending: isWithdrawing, error: withdrawError } = useCancelRequestToJoin();

  // Placeholder avatar generator
  const getPlaceholderImage = (name) => {
    const colors = [
      "bg-blue-500", "bg-green-500", "bg-purple-500",
      "bg-pink-500", "bg-orange-500", "bg-indigo-500"
    ];
    const color = colors[name.length % colors.length];
    return (
      <div className={`w-12 h-12 rounded-md flex items-center justify-center ${color} text-white font-semibold`}>
        {name.charAt(0).toUpperCase()}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <Users className="mr-3" /> My Communities
          </h1>
        </div>

        {/* Error Alert */}
        {(actionError || leaveError || withdrawError) && (
          <div className="mb-6 bg-red-100 border border-red-300 text-red-800 dark:bg-red-900/30 dark:text-red-200 dark:border-red-700 px-4 py-3 rounded-lg flex items-start justify-between">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
              <span className="text-sm">{actionError || leaveError?.message || withdrawError?.message}</span>
            </div>
            <button
              onClick={() => setActionError(null)}
              className="text-xs underline ml-4 text-red-800 dark:text-red-200"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="space-y-8">
          {/* Memberships Section */}
          <section className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-5 pb-3 border-b border-gray-200 dark:border-gray-700 flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-500" /> Community Memberships
            </h2>

            {loadingMemberships ? (
              <div className="flex justify-center py-8">
                <Loader2 className="animate-spin w-6 h-6 text-blue-500" />
              </div>
            ) : membershipError ? (
              <div className="flex items-center justify-center text-red-600 dark:text-red-400 py-8">
                <AlertCircle className="w-5 h-5 mr-2" /> {membershipError.message}
              </div>
            ) : memberships.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Users className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p>You are not a member of any communities yet.</p>
                <button
                  onClick={() => navigate("/communities")}
                  className="mt-4 text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Browse communities
                </button>
              </div>
            ) : (
              <ul className="space-y-4">
                {memberships.map((community) => (
                  <li key={community.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700 flex items-center justify-between hover:shadow-sm">
                    <Link to={`/communities/${community.id}`} className="flex items-center space-x-4 flex-1 group">
                      {community.imageUrl ? (
                        <img src={community.imageUrl} alt={community.name} className="w-12 h-12 object-cover rounded-md" />
                      ) : (
                        getPlaceholderImage(community.name)
                      )}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {community.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">@{community.id}</p>
                      </div>
                    </Link>

                    <button
                      onClick={() => leaveCommunity(community.id)}
                      disabled={isLeaving}
                      className="ml-4 bg-white dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 font-medium py-2 px-4 rounded-lg disabled:opacity-50 flex items-center"
                    >
                      {isLeaving ? (
                        <span className="flex items-center">
                          <Loader2 className="animate-spin w-4 h-4 mr-2" /> Leaving...
                        </span>
                      ) : (
                        <>
                          <LogOut className="w-4 h-4 mr-1" /> Leave
                        </>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Join Requests Section */}
          <section className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-5 pb-3 border-b border-gray-200 dark:border-gray-700 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-amber-500" /> Pending Join Requests
            </h2>

            {joinRequests.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Clock className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p>You have not submitted any join requests.</p>
              </div>
            ) : (
              <ul className="space-y-4">
                {joinRequests.map((req) => (
                  <li key={req.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700 flex items-center justify-between hover:shadow-sm">
                    <div className="flex items-center space-x-4 flex-1">
                      {req.imageUrl ? (
                        <img src={req.imageUrl} alt={req.name} className="w-12 h-12 object-cover rounded-md" />
                      ) : (
                        getPlaceholderImage(req.name)
                      )}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{req.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">@{req.communityId}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          Requested on {new Date(req.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => cancelRequest(req.communityId)}
                      disabled={isWithdrawing}
                      className="ml-4 bg-white dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 font-medium py-2 px-4 rounded-lg disabled:opacity-50 flex items-center"
                    >
                      {isWithdrawing ? (
                        <span className="flex items-center">
                          <Loader2 className="animate-spin w-4 h-4 mr-2" /> Withdrawing...
                        </span>
                      ) : (
                        "Withdraw"
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

