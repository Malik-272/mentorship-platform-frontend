import { useQuery } from "@tanstack/react-query";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const notificationsApi = {
  getNotifications: async () => {
    const response = await fetch(`${API_BASE_URL}/notifications`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to retreive notifications");
    }
    return response.json();
  },
};

export const useGetNotifications = () => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: notificationsApi.getNotifications,
    staleTime: 1000 * 60, // optional: 1 minute cache
  });
};