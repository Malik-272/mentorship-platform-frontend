import { useQuery, useMutation } from "@tanstack/react-query";

const API_BASE_URL = "http://localhost:3000/api/v1";

// Profile API functions
const profileApi = {
  getUserProfile: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
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
  },

  reportUser: async ({ userId, body }) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/report`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to submit report");
    }

    return response.json();
  },
};

// Custom hooks
export const useGetUserProfile = (userId) => {
  return useQuery({
    queryKey: ["userProfile", userId],
    queryFn: () => profileApi.getUserProfile(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useReportUser = () => {
  return useMutation({
    mutationFn: profileApi.reportUser,
    onError: (error) => {
      console.error("Report user error:", error);
    },
  });
};
