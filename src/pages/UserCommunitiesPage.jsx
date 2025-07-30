import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { AlertCircle, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function UserCommunitiesPage() {
  const [actionError, setActionError] = useState(null);
  const { status } = useAuth();
  const [memberships, setMemberships] = useState([]);
  const [joinRequests, setJoinRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [leaveLoading, setLeaveLoading] = useState(null);
  const [withdrawLoading, setWithdrawLoading] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchMemberships() {
      try {
        const res = await fetch("http://localhost:3000/api/v1/communities/my/memberships", {
          credentials: "include",
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch memberships");

        setMemberships(data.memberships);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    async function fetchJoinRequests() {
      try {
        const res = await fetch("http://localhost:3000/api/v1/users/me/join-requests", {
          credentials: "include",
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch join requests");

        setJoinRequests(data.joinRequests);
      } catch (err) {
        console.error(err);
      }
    }

    fetchMemberships();
    fetchJoinRequests();
  }, []);

  const handleLeaveCommunity = async (communityId) => {
    setLeaveLoading(communityId);
    try {
      const res = await fetch("http://localhost:3000/api/v1/communities/my/memberships", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id: communityId }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to leave community");
      }

      setMemberships((prev) => prev.filter((c) => c.id !== communityId));
    } catch (err) {
      setActionError(err.message);
    } finally {
      setLeaveLoading(null);
    }
  };

  const handleWithdrawRequest = async (communityId) => {
    setWithdrawLoading(communityId);
    try {
      const res = await fetch(`http://localhost:3000/api/v1/communities/${communityId}/join-requests`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.status !== 204) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to withdraw join request");
      }

      setJoinRequests((prev) => prev.filter((r) => r.communityId !== communityId));
    } catch (err) {
      setActionError(err.message);
    } finally {
      setWithdrawLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Communities</h1>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      {actionError && (
        <div className="mb-6 bg-red-100 border border-red-300 text-red-800 dark:bg-red-900 dark:text-red-200 dark:border-red-700 px-4 py-3 rounded-lg flex items-start justify-between">
    <div className="flex items-center">
      <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
      <span className="text-sm">{actionError}</span>
    </div>
    <button
      onClick={() => setActionError(null)}
      className="text-xs underline ml-4"
    >
      Dismiss
    </button>
  </div>
)}

        <div className="space-y-8">
          {/* Memberships Section */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Community Memberships</h2>

            {loading ? (
              <div className="text-gray-500 dark:text-gray-400">Loading...</div>
            ) : error ? (
              <div className="flex items-center text-red-600 dark:text-red-400">
                <AlertCircle className="w-5 h-5 mr-2" /> {error}
              </div>
            ) : memberships.length === 0 ? (
              <div className="text-gray-600 dark:text-gray-300">You are not a member of any communities.</div>
            ) : (
              <ul className="space-y-4">
                {memberships.map((community) => (
                  <li
                    key={community.id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700 flex items-center justify-between"
                  >
                    <Link
                      to={`/communities/${community.id}`}
                      className="flex items-center space-x-4 flex-1 hover:underline"
                    >
                      <img
                        src={community.imageUrl}
                        alt={community.name}
                        className="w-12 h-12 object-cover rounded-md"
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {community.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">@{community.id}</p>
                      </div>
                    </Link>

                    <button
                      onClick={() => handleLeaveCommunity(community.id)}
                      disabled={leaveLoading === community.id}
                      className="ml-4 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {leaveLoading === community.id ? (
                        <span className="flex items-center justify-center">
                          <Loader2 className="animate-spin w-4 h-4 mr-2" /> Leaving...
                        </span>
                      ) : (
                        "Leave Community"
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Join Requests Section */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Pending Join Requests</h2>
            {joinRequests.length === 0 ? (
              <div className="text-gray-500 dark:text-gray-400">You have not submitted any join requests.</div>
            ) : (
              <ul className="space-y-4">
  {joinRequests.map((req) => (
    <li
      key={req.id}
      className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700 flex items-center justify-between"
    >
      <div className="flex items-center space-x-4 flex-1">
        <img
          src={req.imageUrl || "https://via.placeholder.com/48?text=C"}
          alt={req.name}
          className="w-12 h-12 object-cover rounded-md"
        />
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{req.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">@{req.communityId}</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Requested on {new Date(req.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <button
        onClick={() => handleWithdrawRequest(req.communityId)}
        disabled={withdrawLoading === req.communityId}
        className="ml-4 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {withdrawLoading === req.communityId ? (
          <span className="flex items-center justify-center">
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
