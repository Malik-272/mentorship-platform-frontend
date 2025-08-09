import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
const API_BASE_URL = "http://localhost:3000/api/v1";

// Mock API functions - replace with actual API calls
const servicesApi = {
  getMentorServices: async () => {
    const response = await fetch(`${API_BASE_URL}/services/my`, {
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

    return data.services
  },
}

export const useGetMentorServices = () => {
  return useQuery({
    queryKey: ["mentorServices"],
    queryFn: servicesApi.getMentorServices,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

