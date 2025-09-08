import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// --- API Logic ---
// (Your API functions remain the same)
const API_BASE_URL = "http://localhost:3000/api/v1";

const fetchUserPreview = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/admin/user-preview/${userId}`, {
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("User not found");
    }
    throw new Error("Failed to fetch user information");
  }

  const data = await response.json();
  if (data.status === "Success") {
    return data.user;
  } else {
    throw new Error("Failed to fetch user information");
  }
};

const banUserApi = async ({ userId, banReason }) => {
  const response = await fetch(`${API_BASE_URL}/admin/banned-users/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      banReason: banReason,
    }),
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to ban user");
  }

  return response.json();
};

const unbanUserApi = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/admin/banned-users/${userId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to unban user");
  }

  return { "status": "Success", "message": "User unbanned successfully" };
};

// --- React Query Hooks ---

export function useUserPreview(userId) {
  // CORRECTED: All options are now inside a single object
  return useQuery({
    queryKey: ["userPreview", userId],
    queryFn: () => fetchUserPreview(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

export function useBanUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: banUserApi,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["userPreview", variables.userId],
      });
    },
    onError: (error) => {
      console.error("Failed to ban user:", error.message);
    },
  });
}

export function useUnbanUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: unbanUserApi,
    onSuccess: (data, userId) => {
      queryClient.invalidateQueries({
        queryKey: ["userPreview", userId],
      });
    },
    onError: (error) => {
      console.error("Failed to unban user:", error.message);
    },
  });
}