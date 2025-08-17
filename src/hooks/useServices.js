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

  getMentorService: async (id) => {
    if (!id) throw new Error("Service ID is required")

    const response = await fetch(`${API_BASE_URL}/services/my/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch service ${id}: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log(data)
    return data.data;
  },

}

export const useGetMentorServices = () => {
  return useQuery({
    queryKey: ["mentorServices"],
    queryFn: servicesApi.getMentorServices,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useGetMentorService = (id) => {
  return useQuery({
    queryKey: ["mentorService", id],
    queryFn: () => servicesApi.getMentorService(id),
    enabled: !!id, // only run if id is provided
    staleTime: 5 * 60 * 1000,
  })
}

