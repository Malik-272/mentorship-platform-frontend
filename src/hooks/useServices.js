import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const API_BASE_URL = "http://localhost:3000/api/v1";

// Services API functions
const servicesApi = {
  createService: async (serviceData) => {
    const response = await fetch(`${API_BASE_URL}/services`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(serviceData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create service");
    }

    return response.json();
  },

  getMyService: async (serviceId) => {
    const response = await fetch(`${API_BASE_URL}/services/my/${serviceId}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch services");
    }

    return response.json();
  },

  getService: async (mentorId, serviceId) => {
    const response = await fetch(
      `${API_BASE_URL}/mentors/${mentorId}/services/${serviceId}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Service not found");
      }
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch service");
    }

    return response.json();
  },

  updateService: async (serviceId, serviceData) => {
    const response = await fetch(`${API_BASE_URL}/services/${serviceId}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(serviceData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update service");
    }

    return response.json();
  },

  deleteService: async (serviceId) => {
    const response = await fetch(`${API_BASE_URL}/services/${serviceId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete service");
    }

    return response.json();
  },
};

// Custom hooks
export const useCreateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: servicesApi.createService,
    onSuccess: (data) => {
      // Invalidate and refetch services list
      queryClient.invalidateQueries(["myServices"]);
    },
    onError: (error) => {
      console.error("Create service error:", error);
    },
  });
};

export const useGetMyService = (serviceId) => {
  return useQuery({
    queryKey: ["myService", serviceId],
    queryFn: () => servicesApi.getMyService(serviceId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useGetService = (mentorId, serviceId) => {
  return useQuery({
    queryKey: ["service", mentorId, serviceId],
    queryFn: () => servicesApi.getService(mentorId, serviceId),
    enabled: !!(mentorId && serviceId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useUpdateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ serviceId, serviceData }) =>
      servicesApi.updateService(serviceId, serviceData),
    onSuccess: (data, variables) => {
      // Update the service cache
      queryClient.setQueryData(
        ["service", data.mentorId, variables.serviceId],
        data
      );
      // Invalidate related queries
      queryClient.invalidateQueries(["myServices"]);
    },
    onError: (error) => {
      console.error("Update service error:", error);
    },
  });
};

export const useDeleteService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: servicesApi.deleteService,
    onSuccess: (data, serviceId) => {
      // Remove from cache
      queryClient.removeQueries(["service"]);
      // Invalidate related queries
      queryClient.invalidateQueries(["myServices"]);
    },
    onError: (error) => {
      console.error("Delete service error:", error);
    },
  });
};
