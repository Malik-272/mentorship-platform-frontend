// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// const API_BASE_URL = "http://localhost:3000/api/v1";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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

export const useUploadCommunityImage = () => {
  return useMutation({
    mutationFn: communitiesApi.uploadCommunityImage,
  });
}

export const useDeleteCommunityImage = () => {
  return useMutation({
    mutationFn: communitiesApi.deleteCommunityImage,
  });
}
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
export const useGetMyCommunityMembers = () => {
  return useQuery({
    queryKey: ["communityMembers"],
    queryFn: () => communitiesApi.getMyMembers(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useRemoveMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (memberId) => communitiesApi.removeMember(memberId),
    onSuccess: () => {
      // Invalidate members to refetch
      queryClient.invalidateQueries(["communityMembers"]);
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
      // queryClient.setQueryData(["community", communityId], (oldData) => ({
      //   ...oldData,
      //   userMembership: null,
      // }));
      queryClient.setQueryData(["joinRequests"], (old = []) =>
        old.filter((r) => r.communityId !== communityId)
      );
    },
  });
};

export const useLeaveCommunity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: communitiesApi.leaveCommunity,
    onSuccess: (data, communityId) => {
      // Update the community cache
      // queryClient.setQueryData(["community", communityId], (oldData) => ({
      //   ...oldData,
      //   userMembership: null,
      //   community: {
      //     ...oldData.community,
      //     member_count: Math.max((oldData.community.member_count || 1) - 1, 0),
      //   },
      // }));
      queryClient.setQueryData(["memberships"], (old = []) =>
        old.filter((c) => c.id !== communityId)
      );
      // Invalidate members list
      queryClient.invalidateQueries(["communityMembers", communityId]);
    },
  });
};

export const useMemberships = () => {
  return useQuery({
    queryKey: ["memberships"],
    queryFn: communitiesApi.fetchMemberships,
  });
};

export const useJoinRequests = () => {
  return useQuery({
    queryKey: ["joinRequests"],
    queryFn: communitiesApi.fetchJoinRequests,
  });
};

// Add to useCommunities.js
export const useGetCommunityServices = (communityId) => {
  return useQuery({
    queryKey: ["communityServices", communityId],
    queryFn: () => communitiesApi.getCommunityServices(communityId),
    enabled: !!communityId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};
