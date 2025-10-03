import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
const API_BASE_URL = "https://mentorship-platform-api-production.up.railway.app:3000/api/v1"

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

    return { success: true, message: `Session request by ${requestId} was deleted` }
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
    onMutate: async (requestId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["menteeSessionRequests"] })

      // Snapshot the previous value
      const previousData = queryClient.getQueryData(["menteeSessionRequests"])

      // Optimistically update by removing the request
      queryClient.setQueryData(["menteeSessionRequests"], (old) => {
        if (!old?.sessionRequests) return old

        const updatedRequests = { ...old.sessionRequests }

        // Find and remove the request from all status arrays
        Object.keys(updatedRequests).forEach((status) => {
          updatedRequests[status] = updatedRequests[status].filter((request) => request.id !== requestId)
        })

        return {
          ...old,
          sessionRequests: updatedRequests,
        }
      })

      // Return context with previous data for rollback
      return { previousData }
    },
    onError: (error, requestId, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(["menteeSessionRequests"], context.previousData)
      }
      console.error("Failed to withdraw session request:", error)
    },
    onSettled: () => {
      // Optionally refetch to ensure consistency (but not required for immediate UI update)
      // queryClient.invalidateQueries({ queryKey: ["menteeSessionRequests"] })
    },
  })
}

export const useUpdateSessionRequestAgenda = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: menteeSessionRequestsApi.updateSessionRequestAgenda,
    onMutate: async ({ requestId, agenda }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["menteeSessionRequests"] })

      // Snapshot the previous value
      const previousData = queryClient.getQueryData(["menteeSessionRequests"])

      // Optimistically update the agenda
      queryClient.setQueryData(["menteeSessionRequests"], (old) => {
        if (!old?.sessionRequests) return old

        const updatedRequests = { ...old.sessionRequests }

        // Find and update the request in all status arrays
        Object.keys(updatedRequests).forEach((status) => {
          updatedRequests[status] = updatedRequests[status].map((request) =>
            request.id === requestId ? { ...request, agenda } : request,
          )
        })

        return {
          ...old,
          sessionRequests: updatedRequests,
        }
      })

      // Return context with previous data for rollback
      return { previousData }
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(["menteeSessionRequests"], context.previousData)
      }
      console.error("Failed to update session agenda:", error)
    },
    onSettled: () => {
      // Optionally refetch to ensure consistency (but not required for immediate UI update)
      // queryClient.invalidateQueries({ queryKey: ["menteeSessionRequests"] })
    },
  })
}
