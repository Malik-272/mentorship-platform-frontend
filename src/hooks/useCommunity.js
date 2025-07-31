import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

const API_BASE_URL = "http://localhost:3000/api/v1";

// Community API functions
const communityApi = {
  getCommunity: async (communityId) => {
    const response = await fetch(`${API_BASE_URL}/communities/${communityId}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Community not found")
      }
      if (response.status === 403) {
        throw new Error("You don't have permission to view this community")
      }
      const error = await response.json()
      throw new Error(error.message || "Failed to fetch community")
    }

    return response.json()
  },

  getCommunityMembers: async (communityId) => {
    const response = await fetch(`${API_BASE_URL}/communities/${communityId}/members`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to fetch community members")
    }

    return response.json()
  },

  requestToJoin: async (communityId) => {
    const response = await fetch(`${API_BASE_URL}/communities/${communityId}/join-requests`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to send join request")
    }

    return response.json()
  },

  joinCommunity: async (communityId) => {
    const response = await fetch(`${API_BASE_URL}/communities/${communityId}/join`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to join community")
    }

    return response.json()
  },

  leaveCommunity: async (communityId) => {
    const response = await fetch(`${API_BASE_URL}/communities/${communityId}/leave`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to leave community")
    }

    return response.json()
  },
}

// Custom hooks
export const useGetCommunity = (communityId) => {
  return useQuery({
    queryKey: ["community", communityId],
    queryFn: () => communityApi.getCommunity(communityId),
    enabled: !!communityId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  })
}

export const useGetCommunityMembers = (communityId, enabled = true) => {
  return useQuery({
    queryKey: ["communityMembers", communityId],
    queryFn: () => communityApi.getCommunityMembers(communityId),
    enabled: !!communityId && enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useRequestToJoin = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: communityApi.requestToJoin,
    onSuccess: (data, communityId) => {
      // Update the community cache to reflect the new membership status
      queryClient.setQueryData(["community", communityId], (oldData) => ({
        ...oldData,
        userMembership: { status: "pending" },
      }))
    },
  })
}

export const useJoinCommunity = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: communityApi.joinCommunity,
    onSuccess: (data, communityId) => {
      // Update the community cache
      queryClient.setQueryData(["community", communityId], (oldData) => ({
        ...oldData,
        userMembership: { status: "approved" },
        community: {
          ...oldData.community,
          member_count: (oldData.community.member_count || 0) + 1,
        },
      }))
      // Invalidate members list
      queryClient.invalidateQueries(["communityMembers", communityId])
    },
  })
}

export const useLeaveCommunity = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: communityApi.leaveCommunity,
    onSuccess: (data, communityId) => {
      // Update the community cache
      queryClient.setQueryData(["community", communityId], (oldData) => ({
        ...oldData,
        userMembership: null,
        community: {
          ...oldData.community,
          member_count: Math.max((oldData.community.member_count || 1) - 1, 0),
        },
      }))
      // Invalidate members list
      queryClient.invalidateQueries(["communityMembers", communityId])
    },
  })
}
