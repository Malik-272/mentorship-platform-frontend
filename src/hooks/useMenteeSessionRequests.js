import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
const API_BASE_URL = "http://localhost:3000/api/v1"

// Mock API functions - replace with actual API calls
const menteeSessionRequestsApi = {
  getMenteeSessionRequests: async () => {
    const response = await fetch(`${API_BASE_URL}/users/me/session-requests`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch services: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data
  },

  withdrawSessionRequest: async (requestId) => {
    const response = await fetch(`${API_BASE_URL}/users/me/session-requests/${requestId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })

    if (!response.ok) {
      throw new Error(`Failed to withdraw session request: ${response.status} ${response.statusText}`)
    }

    return { success: true, message: `Session request by ${requestId} was deleted` };
  },

  updateSessionRequestAgenda: async ({ requestId, agenda }) => {
    const response = await fetch(`${API_BASE_URL}/users/me/session-requests/${requestId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ agenda }),
    })

    if (!response.ok) {
      throw new Error(`Failed to update session agenda: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data
  },
}

export const useGetMenteeSessionRequests = () => {
  return useQuery({
    queryKey: ["menteeSessionRequests"],
    queryFn: menteeSessionRequestsApi.getMenteeSessionRequests,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  })
}

export const useWithdrawSessionRequest = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: menteeSessionRequestsApi.withdrawSessionRequest,
    onSuccess: () => {
      // Invalidate and refetch session requests
      queryClient.invalidateQueries({
        queryKey: ["menteeSessionRequests"],
      })
    },
    onError: (error) => {
      console.error("Failed to withdraw session request:", error)
    },
  })
}

export const useUpdateSessionRequestAgenda = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: menteeSessionRequestsApi.updateSessionRequestAgenda,
    onSuccess: () => {
      // Invalidate and refetch session requests
      queryClient.invalidateQueries({
        queryKey: ["menteeSessionRequests"],
      })
    },
    onError: (error) => {
      console.error("Failed to update session agenda:", error)
    },
  })
}
