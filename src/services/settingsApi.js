const API_BASE_URL = "http://localhost:3000/api/v1"

// Settings API functions
export const settingsApi = {
  updateProfile: async (profileData) => {
    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      method: "PUT",
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

  updateLinks: async (links) => {
    console.log("Updating links:", links)
    const response = await fetch(`${API_BASE_URL}/users/me/links`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: links,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to update links")
    }

    return response.json()
  },

  updatePassword: async (passwordData) => {
    const response = await fetch(`${API_BASE_URL}/user/update-password`, {
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
