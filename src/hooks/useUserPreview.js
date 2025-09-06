import { useState } from "react"
const API_BASE_URL = "http://localhost:3000/api/v1"


export function useUserPreview() {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const searchUser = async (userId) => {
    setIsLoading(true)
    setError(null)
    setUser(null)

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_BASE_URL}/admin/user-preview/${userId}`, {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("User not found")
        }
        throw new Error("Failed to fetch user information")
      }

      const data = await response.json()

      if (data.status === "Success") {
        setUser(data.user)
      } else {
        throw new Error("Failed to fetch user information")
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const banUser = async (userId, banReason) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/admin/users/${userId}/ban`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "ban",
          banReason: banReason,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to ban user")
      }

      // Update user state to reflect ban
      setUser((prevUser) => ({
        ...prevUser,
        basicDetails: {
          ...prevUser.basicDetails,
          isBanned: true,
        },
      }))
    } catch (err) {
      throw new Error(err.message)
    }
  }

  const unbanUser = async (userId) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/admin/users/${userId}/ban`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "unban",
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to unban user")
      }

      // Update user state to reflect unban
      setUser((prevUser) => ({
        ...prevUser,
        basicDetails: {
          ...prevUser.basicDetails,
          isBanned: false,
        },
      }))
    } catch (err) {
      throw new Error(err.message)
    }
  }

  return {
    user,
    isLoading,
    error,
    searchUser,
    banUser,
    unbanUser,
  }
}