const API_BASE_URL = "http://localhost:3000/api/v1";

// Communities API functions
export const communitiesApi = {
  createCommunity: async (payload) => {
    const response = await fetch(`${API_BASE_URL}/communities`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create community");
    }

    return response.json();
  },
  getCommunity: async (communityId) => {
    const response = await fetch(`${API_BASE_URL}/communities/${communityId}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Community not found");
      }
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch community");
    }

    return response.json();
  },
  getMyCommunity: async () => {
    const response = await fetch(`${API_BASE_URL}/communities/my`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        // throw new Error("Community not found");
        return null;
      }
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch community");
    }

    return response.json();
  },
  updateCommunity: async (payload) => {
    console.log("payload:         ", JSON.stringify(payload));
    const response = await fetch(`${API_BASE_URL}/communities/my`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update community");
    }

    return response.json();
  },
  deleteCommunity: async (communityId) => {
    const response = await fetch(`${API_BASE_URL}/communities/${communityId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete community");
    }

    return response.json();
  },

  leaveCommunity: async (communityId) => {
    const response = await fetch(`${API_BASE_URL}/communities/my/memberships`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: `${communityId}`,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to leave community");
    }

    return { success: true, message: "Left community successfully" };
  },

  respondToJoinRequest: async ({ requestId, action, communityId }) => {
    const response = await fetch(
      `${API_BASE_URL}/communities/my/join-requests`,
      {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: requestId, action }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Failed to ${action} join request`);
    }

    return response.json();
  },

  getJoinRequests: async () => {
    const response = await fetch(
      `${API_BASE_URL}/communities/my/join-requests`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();

      if (response.status === 404) {
        return []; // No join requests found
      }
      throw new Error(error.message || "Failed to fetch join requests");
    }

    return response.json();
  },
  getMyMembers: async () => {
    const response = await fetch(`${API_BASE_URL}/communities/my/members`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch members");
    }

    return response.json();
  },

  getCommunityMembers: async (communityId) => {
    const response = await fetch(
      `${API_BASE_URL}/communities/${communityId}/members`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch community members");
    }

    return response.json();
  },

  removeMember: async (memberId) => {
    const response = await fetch(`${API_BASE_URL}/communities/my/members`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: memberId }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let message;
      try {
        message = JSON.parse(errorText).message;
      } catch {
        message = errorText || "Failed to remove member";
      }
      throw new Error(message);
    }

    // 🔑 FIX: check if response has content
    const text = await response.text();
    if (!text) {
      return { success: true }; // fallback if body is empty
    }

    return JSON.parse(text); // safe JSON parsing
  },

  requestToJoin: async (communityId) => {
    const response = await fetch(
      `${API_BASE_URL}/communities/${communityId}/join-requests`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to send join request");
    }

    if (response.status === 204) {
      return { success: true };
    }

    // otherwise parse JSON
    return response.json();
  },

  cancelRequestToJoin: async (communityId) => {
    const response = await fetch(
      `${API_BASE_URL}/communities/${communityId}/join-requests`,
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
      throw new Error(error.message || "Failed to send join request");
    }

    return { success: true, message: "Request to join community cancelled" };
  },

  fetchMemberships: async () => {
    const res = await fetch(`${API_BASE_URL}/communities/my/memberships`, {
      credentials: "include",
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch memberships");
    return data.memberships;
  },

  // for mentor and mentee
  fetchJoinRequests: async () => {
    const res = await fetch(`${API_BASE_URL}/users/me/join-requests`, {
      credentials: "include",
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch join requests");
    return data.joinRequests;
  },

  // Add to communitiesApi.js
  getCommunityServices: async (communityId) => {
    const response = await fetch(`${API_BASE_URL}/communities/${communityId}/services`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch community services");
    }

    return response.json();
  },
  uploadCommunityImage: async (formData) => {
    const response = await fetch(`${API_BASE_URL}/communities/my/picture`, {
      method: 'PUT',
      credentials: 'include',
      body: formData
    });

    if(!response.ok){
      const error = await response.json();
      throw new Error(error.message || "Failed to upload community image");
    }

    return response.json();
  },
  deleteCommunityImage: async () => {
    const response = await fetch(`${API_BASE_URL}/communities/my/picture`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete community image");
    }

    return;
  },
  
};
