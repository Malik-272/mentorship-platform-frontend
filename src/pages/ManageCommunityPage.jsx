import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  useGetCommunityJoinRequests,
  useGetMyCommunityMembers,
  useRespondToJoinRequest,
  useRemoveMember,
  useGetCommunity,
  useGetMyCommunity,
} from "../hooks/useCommunities";
import LoadingSpinner from "../ui/LoadingSpinner";
import ErrorMessage from "../ui/ErrorMessage";
import {
  Users,
  UserPlus,
  UserMinus,
  Check,
  X,
  Crown,
  Shield,
  User,
} from "lucide-react";
import toast from "react-hot-toast";

const ManageCommunityPage = () => {
  const navigate = useNavigate();
  const { data } = useAuth();
  const [activeTab, setActiveTab] = useState("requests");
  const [processingRequest, setProcessingRequest] = useState(null);
  const [removingMember, setRemovingMember] = useState(null);
  const [confirmingRemove, setConfirmingRemove] = useState(null);

  // Check if user has a community
  const {
    data: existingCommunity,
    isLoading: checkingCommunity,
    error: communityError,
  } = useGetMyCommunity();
  console.log("Existing Community:", existingCommunity);
  // Redirect to community creation if no community exists
  useEffect(() => {
    if (!checkingCommunity && !existingCommunity?.community) {
      navigate("/communities/create");
    }
  }, [checkingCommunity, communityError, existingCommunity, navigate]);

  // Fetch join requests and members
  const {
    data: joinRequestsData = { joinRequests: [] },
    isLoading: loadingRequests,
    error: requestsError,
    refetch: refetchRequests,
  } = useGetCommunityJoinRequests();
  const joinRequests = joinRequestsData.joinRequests || [];

  const {
    data: membersRes = [],
    isLoading: loadingMembers,
    error: membersError,
    refetch: refetchMembers,
  } = useGetMyCommunityMembers();
  const members = membersRes.members || [];
  // Mutations
  const respondToJoinRequestMutation = useRespondToJoinRequest();
  const removeMemberMutation = useRemoveMember();

  const handleJoinRequestResponse = async (requestId, action) => {
    setProcessingRequest(requestId);
    try {
      await respondToJoinRequestMutation.mutateAsync({
        requestId,
        action, // 'accept' or 'reject'
        communityId: existingCommunity?.community?.id,
      });
      await refetchRequests();
      if (action === "accept") await refetchMembers();
      toast.success(`Request ${action}ed successfully`);
    } catch (error) {
      console.error(`Failed to ${action} join request:`, error);
      toast.error(`Failed to ${action} request`);
    } finally {
      setProcessingRequest(null);
    }
  };

  const handleRemoveMember = async (memberId) => {
    setConfirmingRemove(memberId);
  };

  const handleConfirmRemove = async () => {
  if (!confirmingRemove) return;
  setRemovingMember(confirmingRemove);
  try {
    await removeMemberMutation.mutateAsync(confirmingRemove);
    await refetchMembers();
    toast.success("Member removed successfully");
  } catch (error) {
    console.error("Failed to remove member:", error);
    toast.error("Failed to remove member");
  } finally {
    setRemovingMember(null);
    setConfirmingRemove(null);
  }
};

const handleCancelRemove = () => {
  setConfirmingRemove(null); // Just close the modal
};

  const getRoleIcon = (role) => {
    switch (role) {
      case "community_manager":
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case "mentor":
        return <Shield className="w-4 h-4 text-blue-500" />;
      default:
        return <User className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case "Community_Manager":
        return "Manager";
      case "MENTOR":
        return "Mentor";
      case "MENTEE":
        return "Mentee";
      default:
        return "Member";
    }
  };

  // Show loading while checking authentication and community
  if (checkingCommunity) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Show error if community check failed
  if (communityError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorMessage message="Failed to load community information" />
      </div>
    );
  }

  // Don't render if no community (will redirect)
  if (!existingCommunity.community) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Back Arrow Navigation */}
      <div className="max-w-6xl mx-auto px-4 pt-8">
        <button
          onClick={() => navigate("/communities/my")}
          className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-2 mb-4"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to community
        </button>
      </div>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Manage Community
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Manage join requests and members for{" "}
            <span className="font-semibold">
              {existingCommunity?.community?.name}
            </span>
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("requests")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "requests"
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  Join Requests
                  {joinRequests.length > 0 && (
                    <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300">
                      {joinRequests.length}
                    </span>
                  )}
                </div>
              </button>
              <button
                onClick={() => setActiveTab("members")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "members"
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Members ({members.length})
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        {activeTab === "requests" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Pending Join Requests
                </h2>

                {loadingRequests ? (
                  <div className="flex justify-center py-8">
                    <LoadingSpinner />
                  </div>
                ) : requestsError ? (
                  <ErrorMessage message="Failed to load join requests" />
                ) : joinRequests.length === 0 ? (
                  <div className="text-center py-8">
                    <UserPlus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                      No pending join requests
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {joinRequests.map((request) => (
                      <div
                        key={request.id}
                        className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {request.user.imageUrl ? (
                              <img
                                src={request.user.imageUrl}
                                alt={request.user.name}
                                className="w-12 h-12 rounded-full"
                              />
                            ) : (
                              request.user.name.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {request.user.name}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {request.user.headline || "No headline provided"}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500">
                              Requested{" "}
                              {new Date(request.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              handleJoinRequestResponse(request.id, "accept")
                            }
                            disabled={processingRequest === request.id}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg font-medium transition-colors"
                          >
                            {processingRequest === request.id ? (
                              <LoadingSpinner size="sm" />
                            ) : (
                              <Check className="w-4 h-4" />
                            )}
                            Accept
                          </button>
                          <button
                            onClick={() =>
                              handleJoinRequestResponse(request.id, "reject")
                            }
                            disabled={processingRequest === request.id}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg font-medium transition-colors"
                          >
                            {processingRequest === request.id ? (
                              <LoadingSpinner size="sm" />
                            ) : (
                              <X className="w-4 h-4" />
                            )}
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "members" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Community Members
                </h2>

                {loadingMembers ? (
                  <div className="flex justify-center py-8">
                    <LoadingSpinner />
                  </div>
                ) : membersError ? (
                  <ErrorMessage message="Failed to load members" />
                ) : members.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                      No members yet
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {members.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {member.imageUrl ? (
                              <img
                                src={member.imageUrl}
                                alt={member.name}
                                className="w-12 h-12 rounded-full"
                              />
                            ) : (
                              member.name.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-gray-900 dark:text-white">
                                {member.name}
                              </h3>
                              {getRoleIcon(member.role)}
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {getRoleLabel(member.role)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {member.headline || "No headline provided"}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500">
                              Joined{" "}
                              {new Date(member.joinedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {member.id !== data?.user.id &&
                            member.role !== "community_manager" && (
                              <button
                                onClick={() => handleRemoveMember(member.id)}
                                disabled={removingMember === member.id}
                                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg font-medium transition-colors"
                              >
                                {removingMember === member.id ? (
                                  <LoadingSpinner size="sm" />
                                ) : (
                                  <UserMinus className="w-4 h-4" />
                                )}
                                Remove
                              </button>
                            )}
                          {member.id === data?.user.id && (
                            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                              You
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      {confirmingRemove && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Confirm Removal
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to remove this member from your community?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancelRemove}
                className="px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRemove}
                disabled={removingMember === confirmingRemove}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:bg-red-400"
              >
                {removingMember === confirmingRemove ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  "Remove"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCommunityPage;
