import { useQuery, useQueries } from "@tanstack/react-query"
import { useAuth } from "../context/AuthContext"
import { communitiesApi } from "../services/communitiesApi"
import { userReportsApi } from "./useUserReports"
import { bannedUsersApi, useBannedUsers } from "./useBannedUsers"

// API functions
// const fetchUserData = async () => {
//   const response = await fetch("/api/user/profile", {
//     headers: { "Content-Type": "application/json" },
//   })
//   if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
//   const data = await response.json()
//   if (data.status !== "Success") throw new Error(data.message || "Failed to fetch user data")
//   return data.data
// }

// const fetchCommunityMemberships = async () => {
//   const response = await fetch("/api/communities/my/memberships", {
//     headers: { "Content-Type": "application/json" },
//   })
//   if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
//   const data = await response.json()
//   if (data.status !== "Success") throw new Error(data.message || "Failed to fetch memberships")
//   return data.data || []
// }

const fetchSessionRequests = async () => {
  const response = await fetch("http://localhost:3000/api/v1/dashboard/mentee/session-requests", {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  })
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
  const data = await response.json()
  if (data.status !== "Success") throw new Error(data.message || "Failed to fetch session requests")
  return data.sessionRequests || []
}

const getUserProfile = async (userId) => {
  const response = await fetch(`http://localhost:3000/api/v1/users/${userId}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("User not found");
    }
    if (response.status === 403) {
      throw new Error("You don't have permission to view this profile");
    }
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch user profile");
  }

  return response.json();
};

const fetchTodayEvents = async () => {
  const response = await fetch("http://localhost:3000/api/v1/dashboard/today-events", {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  })
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
  const data = await response.json()
  if (data.status !== "Success") throw new Error(data.message || "Failed to fetch today events")
  return data.events || []

}

// const fetchRoleDashboardData = async (role) => {
//   let endpoint = ""
//   switch (role) {
//     case "MENTEE":
//       endpoint = "/api/dashboard/mentee"
//       break
//     case "MENTOR":
//       endpoint = "/api/dashboard/mentor"
//       break
//     case "COMMUNITY_MANAGER":
//       endpoint = "/api/dashboard/community-manager"
//       break
//     case "ADMIN":
//       endpoint = "/api/dashboard/admin"
//       break
//     default:
//       throw new Error("Invalid user role")
//   }

//   const response = await fetch(endpoint, {
//     headers: { "Content-Type": "application/json" },
//   })
//   if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
//   const data = await response.json()
//   if (data.status !== "Success") throw new Error(data.message || "Failed to fetch dashboard data")
//   return data.data
// }

const searchUsersAndCommunities = async (query) => {
  const response = await fetch(`http://localhost:3000/api/v1/dashboard/search?query=${encodeURIComponent(query)}`, {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  })
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
  const data = await response.json()
  if (data.status !== "Success") throw new Error(data.message || "Search failed")
  return {
    users: data.users || [],
    communities: data.communities || [],
  }
}

export function useDashboard() {
  const { data: authData } = useAuth()
  const user = authData?.user

  // Main dashboard queries using useQueries for parallel execution
  const queries = useQueries({
    queries: [
      // {
      //   queryKey: ["user-data"],
      //   queryFn: getUserProfile(user.id),
      //   enabled: !!user,
      // },
      {
        queryKey: ["user-data", user?.id],
        queryFn: () => getUserProfile(user.id),
        enabled: !!user,
      },
      {
        queryKey: ["community-memberships"],
        queryFn: communitiesApi.fetchMemberships,
        enabled: !!user && (user.role === "MENTEE" || user.role === "MENTOR"),
      },
      {
        queryKey: ["session-requests-pending"],
        queryFn: fetchSessionRequests,
        enabled: !!user && user.role === "MENTEE",
      },
      {
        queryKey: ["today-events"],
        queryFn: fetchTodayEvents,
        enabled: !!user && (user.role === "MENTEE" || user.role === "MENTOR"),
      },
      {
        queryKey: ["my-Community"],
        queryFn: communitiesApi.getMyCommunity,
        enabled: !!user && user.role == "COMMUNITY_MANAGER"
      },
      {
        queryKey: ["join-request-dashboard"],
        queryFn: communitiesApi.getJoinRequests,
        enabled: !!user && user.role == "COMMUNITY_MANAGER"
      },
      {
        queryKey: ["pendingReports"],
        queryFn: userReportsApi.getUserReports,
        enabled: !!user && user.role === "ADMIN",
      },
      {
        queryKey: ["bannedUsers"],
        queryFn: bannedUsersApi.getBannedUsers,
        enabled: !!user && user.role === "ADMIN",
      }
      // {
      //   queryKey: ["dashboard-data", user?.role],
      //   queryFn: () => fetchRoleDashboardData(user.role),
      //   enabled: !!user,
      // },
    ],
  })
  console.log("Queries", queries)
  const [userDataQuery, membershipsQuery, sessionRequestsQuery, todayEventsQuery, myCommunity, joinRequestsQuery, pendingReportsQuery, bannedUsersQuery, dashboardDataQuery] = queries

  // Combine all data
  const dashboardData = {
    // ...dashboardDataQuery.data,
    userData: userDataQuery.data,
    communities: membershipsQuery.data,
    sessionRequests: sessionRequestsQuery.data,
    todayEvents: todayEventsQuery.data,
    community: myCommunity.data,
    joinRequests: joinRequestsQuery.data,
    userReports: pendingReportsQuery.data,
    bannedUsers: bannedUsersQuery.data,
  }

  // Overall loading state
  const loading = queries.some((query) => query.isLoading)

  // Overall error state
  const error = queries.find((query) => query.error)?.error?.message || null

  // Search function using React Query
  const searchUsers = async (query) => {
    return await searchUsersAndCommunities(query)
  }

  // Refresh function
  const refreshDashboard = () => {
    queries.forEach((query) => query.refetch())
  }

  return {
    dashboardData,
    loading,
    error,
    searchUsers,
    refreshDashboard,
    // Individual query states for granular control
    queries: {
      userData: userDataQuery,
      memberships: membershipsQuery,
      sessionRequests: sessionRequestsQuery,
      todayEvents: todayEventsQuery,
      dashboardData: dashboardDataQuery,
    },
  }
}

// Hook for search functionality with debouncing
export function useSearch() {
  return useQuery({
    queryKey: ["search"],
    queryFn: () => null, // Will be triggered manually
    enabled: false,
  })
}
