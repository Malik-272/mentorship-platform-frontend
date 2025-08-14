import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
const API_BASE_URL = "http://localhost:3000/api/v1";

// Mock API functions - replace with actual API calls
const sessionRequestsApi = {
  getServiceSessionRequests: async (id) => {
    const response = await fetch(`${API_BASE_URL}/services/my/${id}/session-requests`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch services: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    return data;
  },

  acceptSessionRequest: async ({ serviceId, requestId }) => {
    console.log("Accepting session request:", { serviceId, requestId })
    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return { success: true, message: "Session request accepted successfully" }
  },

  rejectSessionRequest: async ({ serviceId, requestId, reason }) => {
    console.log("Rejecting session request:", { serviceId, requestId, reason })
    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return { success: true, message: "Session request rejected successfully" }
  },

  cancelSessionRequest: async ({ serviceId, requestId, reason }) => {
    console.log("Canceling session request:", { serviceId, requestId, reason })
    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return { success: true, message: "Session canceled successfully" }
  },
}

export const useGetServiceSessionRequests = (serviceId) => {
  return useQuery({
    queryKey: ["serviceSessionRequests", serviceId],
    queryFn: () => sessionRequestsApi.getServiceSessionRequests(serviceId),
    enabled: !!serviceId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  })
}

export const useAcceptSessionRequest = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: sessionRequestsApi.acceptSessionRequest,
    onSuccess: (data, variables) => {
      // Invalidate and refetch session requests
      queryClient.invalidateQueries({
        queryKey: ["serviceSessionRequests", variables.serviceId],
      })
      // Also invalidate the services list to update pending counts
      queryClient.invalidateQueries({
        queryKey: ["mentorServices"],
      })
    },
    onError: (error) => {
      console.error("Failed to accept session request:", error)
    },
  })
}

export const useRejectSessionRequest = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: sessionRequestsApi.rejectSessionRequest,
    onSuccess: (data, variables) => {
      // Invalidate and refetch session requests
      queryClient.invalidateQueries({
        queryKey: ["serviceSessionRequests", variables.serviceId],
      })
      // Also invalidate the services list to update pending counts
      queryClient.invalidateQueries({
        queryKey: ["mentorServices"],
      })
    },
    onError: (error) => {
      console.error("Failed to reject session request:", error)
    },
  })
}

export const useCancelSessionRequest = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: sessionRequestsApi.cancelSessionRequest,
    onSuccess: (data, variables) => {
      // Invalidate and refetch session requests
      queryClient.invalidateQueries({
        queryKey: ["serviceSessionRequests", variables.serviceId],
      })
      // Also invalidate the services list to update pending counts
      queryClient.invalidateQueries({
        queryKey: ["mentorServices"],
      })
    },
    onError: (error) => {
      console.error("Failed to cancel session request:", error)
    },
  })
}
