import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
const API_BASE_URL = "http://localhost:3000/api/v1"

// Mock API functions - replace with actual API calls
const userReportsApi = {
  getUserReports: async () => {
    // Simulate API call
    const response = await fetch(`${API_BASE_URL}/admin/user-reports`, {
      headers: {
        // Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    })

    if (!response.ok) {
      throw new Error("Failed to fetch user reports")
    }

    const reportsData = await response.json()
    console.log("reportsData", reportsData)
    return reportsData
  },

  resolveUserReport: async ({ reportId, action, banReason }) => {
    const body = { action }
    if (banReason) {
      body.banReason = banReason
    }

    const response = await fetch(`${API_BASE_URL}/admin/user-reports/${reportId}`, {
      method: "PUT",
      headers: {
        // Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error("Failed to resolve user report")
    }

    return response.json()
  },
}

export const useUserReports = () => {
  return useQuery({
    queryKey: ["userReports"],
    queryFn: userReportsApi.getUserReports,
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  })
}

export const useResolveUserReport = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: userReportsApi.resolveUserReport,
    onSuccess: () => {
      // Invalidate and refetch user reports
      queryClient.invalidateQueries({ queryKey: ["userReports"] })
    },
    onError: (error) => {
      console.error("Failed to resolve user report:", error)
    },
  })
}