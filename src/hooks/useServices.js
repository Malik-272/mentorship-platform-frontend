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
  getMyService: async (serviceId) => {
    const response = await fetch(`${API_BASE_URL}/services/my/${serviceId}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch service ${serviceId}: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log(data)
    return data.data;
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
    const response = await fetch(`${API_BASE_URL}/services/my/${serviceId}`, {
      method: "PATCH",
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
    const response = await fetch(`${API_BASE_URL}/services/my/${serviceId}`, {
      method: "DELETE",
      credentials: "include",
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to delete service")
    }

    return { status: "success", message: "Service deleted successfully" }
  },

  addSlot: async (serviceId, slotData) => {
    const response = await fetch(
      `${API_BASE_URL}/services/my/${serviceId}/day-availabilities`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(slotData),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to add slot");
    }

    return response.json();
  },
  updateSlot: async (serviceId, slotId, slotData) => {
    const response = await fetch(
      `${API_BASE_URL}/services/my/${serviceId}/day-availabilities/${slotId}`,
      {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(slotData),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update slot");
    }

    return response.json();
  },
  deleteSlot: async (serviceId, slotId) => {
    const response = await fetch(
      `${API_BASE_URL}/services/my/${serviceId}/day-availabilities/${slotId}`,
      {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete slot");
    }
    if (response.status === 204) {
      return null;
    }

    return response.json();
  },
  addExceptionSlot: async (serviceId, slotData) => {
    const response = await fetch(
      `${API_BASE_URL}/services/my/${serviceId}/availability-exceptions`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(slotData),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to add exception slot");
    }

    return response.json();
  },
  updateExceptionSlot: async (serviceId, slotId, slotData) => {
    const response = await fetch(
      `${API_BASE_URL}/services/my/${serviceId}/availability-exceptions/${slotId}`,
      {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(slotData),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update exception slot");
    }

    return response.json();
  },
  removeExceptionSlot: async (serviceId, slotId) => {
    const response = await fetch(
      `${API_BASE_URL}/services/my/${serviceId}/availability-exceptions/${slotId}`,
      {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      let errorMessage = "Failed to remove exception slot";
      try {
        const error = await response.json();
        errorMessage = error.message || errorMessage;
      } catch (e) {
        // ignore if no JSON error body
      }
      throw new Error(errorMessage);
    }

    // DELETE often returns 204 No Content, so check before parsing
    const text = await response.text();
    return text ? JSON.parse(text) : null;
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

export const useGetMentorServices = () => {
  return useQuery({
    queryKey: ["mentorServices"],
    queryFn: servicesApi.getMentorServices,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

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
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: servicesApi.deleteService,
    onMutate: async (serviceId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["mentorServices"] })

      // Snapshot the previous value
      const previousData = queryClient.getQueryData(["mentorServices"])

      // Optimistically update by removing the service
      queryClient.setQueryData(["mentorServices"], (oldServices) => {
        if (!oldServices) return oldServices
        return oldServices.filter((service) => service.id !== serviceId)
      })

      // Return context with previous data for rollback
      return { previousData }
    },
    onError: (error, serviceId, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(["mentorServices"], context.previousData)
      }
      console.error("Failed to delete service:", error)
    },
    onSettled: () => {
      // Optionally refetch to ensure consistency (but not required for immediate UI update)
      // queryClient.invalidateQueries({ queryKey: ["mentorServices"] })
    },
  })
}

export const useAddSlot = (serviceId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slotData) => servicesApi.addSlot(serviceId, slotData),
    onSuccess: (data) => {
      // Invalidate and refetch service slots
      queryClient.invalidateQueries(["myService", serviceId]);
    },
    onError: (error) => {
      console.error("Add slot error:", error);
    },
  });
};
export const useUpdateSlot = (serviceId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ slotData, slotId }) =>
      servicesApi.updateSlot(serviceId, slotId, slotData),
    onSuccess: (data) => {
      // Invalidate and refetch service slots
      queryClient.invalidateQueries(["myService", serviceId]);
    },
    onError: (error) => {
      console.error("Update slot error:", error);
    },
  });
};
export const useDeleteSlot = (serviceId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slotId) => servicesApi.deleteSlot(serviceId, slotId),
    onSuccess: (data) => {
      // Invalidate and refetch service slots
      queryClient.invalidateQueries(["myService", serviceId]);
    },
    onError: (error) => {
      console.error("Delete slot error:", error);
    },
  });
};

export const useAddExceptionSlot = (serviceId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slotData) => servicesApi.addExceptionSlot(serviceId, slotData),
    onSuccess: (data) => {
      // Invalidate and refetch service slots
      queryClient.invalidateQueries(["myService", serviceId]);
    },
    onError: (error) => {
      console.error("Add exception slot error:", error);
    },
  });
};
export const useUpdateExceptionSlot = (serviceId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ slotId, slotData }) =>
      servicesApi.updateExceptionSlot(serviceId, slotId, slotData),
    onSuccess: (data) => {
      // Invalidate and refetch service slots
      queryClient.invalidateQueries(["myService", serviceId]);
    },
    onError: (error) => {
      console.error("Update exception slot error:", error);
    },
  });
};
export const useRemoveExceptionSlot = (serviceId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slotId) => servicesApi.removeExceptionSlot(serviceId, slotId),
    onSuccess: (data) => {
      // Invalidate and refetch service slots
      queryClient.invalidateQueries(["myService", serviceId]);
    },
    onError: (error) => {
      console.error("Remove exception slot error:", error);
    },
  });
};
