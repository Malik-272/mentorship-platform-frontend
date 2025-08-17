import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const API_BASE_URL = "http://localhost:3000/api/v1";

// Communities API functions
const communitiesApi = {
  createCommunity: async (payload) => {
    const response = await fetch(`${API_BASE_URL}/communities`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create community");
    }

    return response.json();
  },
  getCommunity: async (communityId) => {
    const response = await fetch(`${API_BASE_URL}/communities/${communityId}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Community not found");
      }
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch community");
    }

    return response.json();
  },
  getMyCommunity: async () => {
    const response = await fetch(`${API_BASE_URL}/communities/my`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Community not found");
      }
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch community");
    }

    return response.json();
  },
  updateCommunity: async (payload) => {
    console.log("payload:         ", JSON.stringify(payload));
    const response = await fetch(`${API_BASE_URL}/communities/my`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update community");
    }

    return response.json();
  },
  deleteCommunity: async (communityId) => {
    const response = await fetch(`${API_BASE_URL}/communities/${communityId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete community");
    }

    return response.json();
  },

  leaveCommunity: async (communityId) => {
    const response = await fetch(`${API_BASE_URL}/communities/my/memberships`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: `${communityId}`,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to leave community");
    }

    return { success: true, message: "Left community successfully" };
  },

  respondToJoinRequest: async ({ requestId, action, communityId }) => {
    const response = await fetch(
      `${API_BASE_URL}/communities/my/join-requests`,
      {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: requestId, action }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Failed to ${action} join request`);
    }

    return response.json();
  },

  getJoinRequests: async () => {
    const response = await fetch(
      `${API_BASE_URL}/communities/my/join-requests`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch join requests");
    }

    return response.json();
  },
  getMyMembers: async (communityId) => {
    const response = await fetch(`${API_BASE_URL}/communities/my/members`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch members");
    }

    return response.json();
  },

  getCommunityMembers: async (communityId) => {
    const response = await fetch(
      `${API_BASE_URL}/communities/${communityId}/members`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch community members");
    }

    return response.json();
  },

  removeMember: async ({ memberId }) => {
    const response = await fetch(`${API_BASE_URL}/communities/my/members`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: { memberId },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to remove member");
    }

    return response.json();
  },

  requestToJoin: async (communityId) => {
    const response = await fetch(
      `${API_BASE_URL}/communities/${communityId}/join-requests`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to send join request");
    }

    return response.json();
  },

  cancelRequestToJoin: async (communityId) => {
    const response = await fetch(
      `${API_BASE_URL}/communities/${communityId}/join-requests`,
      {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to send join request");
    }

    return { success: true, message: "Request to join community cancelled" };
  },
};

// Custom hooks
import { communitiesApi } from "../services/communitiesApi";

export const useCreateCommunity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: communitiesApi.createCommunity,
    onSuccess: (data) => {
      // Invalidate and refetch existing community check
      queryClient.invalidateQueries(["existingCommunity"]);
      // Cache the new community
      queryClient.setQueryData(["community", data.community.id], data);
    },
    onError: (error) => {
      console.error("Create community error:", error);
    },
  });
};

export const useGetCommunity = (communityId) => {
  return useQuery({
    queryKey: ["community", communityId],
    queryFn: () => communitiesApi.getCommunity(communityId),
    enabled: !!communityId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};
export const useGetMyCommunity = () => {
  return useQuery({
    queryKey: ["myCommunity"],
    queryFn: communitiesApi.getMyCommunity,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};
export const useUpdateCommunity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: communitiesApi.updateCommunity,
    onSuccess: (data, variables) => {
      // Update the community cache
      queryClient.setQueryData(["community", variables.communityId], data);
      // Invalidate related queries
      queryClient.invalidateQueries(["communities"]);
    },
    onError: (error) => {
      console.error("Update community error:", error);
    },
  });
};

// export const useDeleteCommunity = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: communitiesApi.deleteCommunity,
//     onSuccess: (data, communityId) => {
//       // Remove from cache
//       queryClient.removeQueries(["community", communityId]);
//       // Invalidate related queries
//       queryClient.invalidateQueries(["communities"]);
//       queryClient.invalidateQueries(["existingCommunity"]);
//     },
//     onError: (error) => {
//       console.error("Delete community error:", error);
//     },
//   });
// };

// export const useJoinCommunity = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: communitiesApi.joinCommunity,
//     onSuccess: (data, communityId) => {
//       // Invalidate community data to refetch member count
//       queryClient.invalidateQueries(["community", communityId]);
//       queryClient.invalidateQueries(["communities"]);
//     },
//     onError: (error) => {
//       console.error("Join community error:", error);
//     },
//   });
// };
export const useGetCommunityJoinRequests = () => {
  return useQuery({
    queryKey: ["communityJoinRequests"],
    queryFn: communitiesApi.getJoinRequests,
    staleTime: 30 * 1000, // 30 seconds
    cacheTime: 5 * 60 * 1000, // 5 minutes
  });
};
// export const useLeaveCommunity = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: communitiesApi.leaveCommunity,
//     onSuccess: (data, communityId) => {
//       // Invalidate community data to refetch member count
//       queryClient.invalidateQueries(["community", communityId]);
//       queryClient.invalidateQueries(["communities"]);
//     },
//     onError: (error) => {
//       console.error("Leave community error:", error);
//     },
//   });
// };
export const useGetMyCommunityMembers = (communityId) => {
  return useQuery({
    queryKey: ["communityMembers", communityId],
    queryFn: () => communitiesApi.getMyMembers(communityId),
    enabled: !!communityId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useRemoveMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: communitiesApi.removeMember,
    onSuccess: (data, variables) => {
      // Invalidate members to refetch
      queryClient.invalidateQueries([
        "communityMembers",
        variables.communityId,
      ]);
      // Invalidate community data to update member count
      queryClient.invalidateQueries(["community", variables.communityId]);
    },
    onError: (error) => {
      console.error("Remove member error:", error);
    },
  });
};

export const useGetCommunityMembers = (communityId, enabled = true) => {
  return useQuery({
    queryKey: ["communityMembers", communityId],
    queryFn: () => communitiesApi.getCommunityMembers(communityId),
    enabled: !!communityId && enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useRespondToJoinRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: communitiesApi.respondToJoinRequest,
    onSuccess: (data, variables) => {
      // Invalidate join requests to refetch
      queryClient.invalidateQueries([
        "communityJoinRequests",
        variables.communityId,
      ]);
      // If accepted, invalidate members to refetch
      if (variables.action === "accept") {
        queryClient.invalidateQueries([
          "communityMembers",
          variables.communityId,
        ]);
      }
    },
    onError: (error) => {
      console.error("Respond to join request error:", error);
    },
  });
};

export const useRequestToJoin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: communitiesApi.requestToJoin,
    onSuccess: (data, communityId) => {
      // Update the community cache to reflect the new membership status
      queryClient.setQueryData(["community", communityId], (oldData) => ({
        ...oldData,
        userMembership: { status: "pending" },
      }));
    },
  });
};

export const useCancelRequestToJoin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: communitiesApi.cancelRequestToJoin,
    onSuccess: (data, communityId) => {
      // Update the community cache to reflect the new membership status
      queryClient.setQueryData(["community", communityId], (oldData) => ({
        ...oldData,
        userMembership: null,
      }));
    },
  });
};

export const useLeaveCommunity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: communitiesApi.leaveCommunity,
    onSuccess: (data, communityId) => {
      // Update the community cache
      queryClient.setQueryData(["community", communityId], (oldData) => ({
        ...oldData,
        userMembership: null,
        community: {
          ...oldData.community,
          member_count: Math.max((oldData.community.member_count || 1) - 1, 0),
        },
      }));
      // Invalidate members list
      queryClient.invalidateQueries(["communityMembers", communityId]);
    },
  });
};
