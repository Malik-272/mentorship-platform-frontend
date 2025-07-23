const API_BASE_URL = "http://localhost:3000/api/v1"

// Settings API functions
export const settingsApi = {
  // Get user profile with field restrictions
  getUserProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      method: "GET",
      credentials: "include",
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to fetch user profile")
    }

    return response.json()
  },
  updateProfile: async (profileData) => {
    console.log(profileData)
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(profileData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to update profile")
    }

    return response.json()
  },

  uploadAvatar: async (formData) => {
    const response = await fetch(`${API_BASE_URL}/user/avatar`, {
      method: "POST",
      credentials: "include",
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to upload avatar")
    }

    return response.json()
  },

  deleteAvatar: async () => {
    const response = await fetch(`${API_BASE_URL}/user/avatar`, {
      method: "DELETE",
      credentials: "include",
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to delete avatar")
    }

    return response.json()
  },

  // Updated link operations to match your API endpoints
  getUserLinks: async () => {
    const response = await fetch(`${API_BASE_URL}/users/me/links`, {
      method: "GET",
      credentials: "include",
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to fetch user links")
    }

    return response.json()
  },

  addLink: async (linkData) => {
    const response = await fetch(`${API_BASE_URL}/users/me/links`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(linkData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to add link")
    }

    return response.json()
  },

  updateLink: async (id, linkData) => {
    const response = await fetch(`${API_BASE_URL}/users/me/links/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(linkData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to update link")
    }

    return response.json()
  },

  deleteLink: async (id) => {
    if (!id) {
      throw new Error("Link ID is required for deletion")
    }

    const response = await fetch(`${API_BASE_URL}/users/me/links/${id}`, {
      method: "DELETE",
      credentials: "include",
    })

    if (!response.ok) {
      const error = await response.json()
      console.error("Delete link error response:", error)
      throw new Error(error.message || "Failed to delete link")
    }
    if (response.status == 204)
      return { "success": true, "message": "Link deleted" }
    return response.json()
  },

  updatePassword: async (passwordData) => {
    const response = await fetch(`${API_BASE_URL}/auth/update-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(passwordData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to change password")
    }

    return response.json()
  },

  toggle2FA: async (enabled) => {
    const response = await fetch(`${API_BASE_URL}/user/2fa`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ enabled }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to toggle 2FA")
    }

    return response.json()
  },
}