import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
const API_BASE_URL = "https://mentorship-platform-api-production.up.railway.app:3000/api/v1"

// Mock API functions - replace with actual API calls
const sessionRequestsApi = {
  getServiceSessionRequests: async (id) => {
    const response = await fetch(`${API_BASE_URL}/services/my/${id}/session-requests`, {
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

  updateSessionRequest: async ({ serviceId, requestId, status, agenda, rejectionReason }) => {
    const response = await fetch(`${API_BASE_URL}/services/my/${serviceId}/session-requests/${requestId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        status,
        ...(agenda && { agenda }),
        ...(rejectionReason && { rejectionReason }),
      }),
    })

    if (!response.ok) {
      const res = await response.json();
      throw new Error( res.message ||`Failed to update session request: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data
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
    mutationFn: ({ serviceId, requestId, agenda }) =>
      sessionRequestsApi.updateSessionRequest({
        serviceId,
        requestId,
        status: "accepted",
        agenda,
      }),
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
    mutationFn: ({ serviceId, requestId, rejectionReason }) =>
      sessionRequestsApi.updateSessionRequest({
        serviceId,
        requestId,
        status: "rejected",
        rejectionReason,
      }),
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
    mutationFn: ({ serviceId, requestId, rejectionReason }) =>
      sessionRequestsApi.updateSessionRequest({
        serviceId,
        requestId,
        status: "cancelled",
        rejectionReason,
      }),
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
