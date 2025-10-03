import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
const API_BASE_URL = "https://mentorship-platform-api-production.up.railway.app:3000/api/v1";

// API functions for banned users management
export const bannedUsersApi = {
  getBannedUsers: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/banned-users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch banned users");
    }

    const data = await response.json();
    return data;
  },

  unbanUser: async (userId) => {
    const response = await fetch(
      `${API_BASE_URL}/admin/banned-users/${userId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to unban user");
    }

    // Check if response has body
    const text = await response.text();
    return text ? JSON.parse(text) : { success: true };
  },
};

export const useBannedUsers = () => {
  return useQuery({
    queryKey: ["bannedUsers"],
    queryFn: bannedUsersApi.getBannedUsers,
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
};

export const useUnbanUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bannedUsersApi.unbanUser,
    onMutate: async (userId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["bannedUsers"] });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData(["bannedUsers"]);

      // Optimistically update by removing the user from banned list
      queryClient.setQueryData(["bannedUsers"], (old) => {
        if (!old?.bannedUsers) return old;

        return {
          ...old,
          bannedUsers: old.bannedUsers.filter((user) => user.id !== userId),
        };
      });

      // Return context with previous data for rollback
      return { previousData };
    },
    onError: (error, userId, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(["bannedUsers"], context.previousData);
      }
      console.error("Failed to unban user:", error);
    },
    onSuccess: () => {
      // Invalidate and refetch banned users
      queryClient.invalidateQueries({ queryKey: ["bannedUsers"] });
    },
  });
};
