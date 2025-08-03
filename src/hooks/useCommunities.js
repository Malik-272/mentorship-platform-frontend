import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  })
}

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
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: communitiesApi.requestToJoin,
    onSuccess: (data, communityId) => {
      // Update the community cache to reflect the new membership status
      queryClient.setQueryData(["community", communityId], (oldData) => ({
        ...oldData,
        userMembership: { status: "pending" },
      }))
    },
  })
}

export const useCancelRequestToJoin = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: communitiesApi.cancelRequestToJoin,
    onSuccess: (data, communityId) => {
      // Update the community cache to reflect the new membership status
      queryClient.setQueryData(["community", communityId], (oldData) => ({
        ...oldData,
        userMembership: null,
      }))
    }
  })
}

export const useLeaveCommunity = () => {
  const queryClient = useQueryClient()

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
      }))
      // Invalidate members list
      queryClient.invalidateQueries(["communityMembers", communityId])
    },
  })
}
