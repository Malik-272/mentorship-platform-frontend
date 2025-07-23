import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { settingsApi } from "../services/settingsApi"

// Custom hooks
export const useGetUserProfile = () => {
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: settingsApi.getUserProfile,
  })
}
export const useUpdateProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: settingsApi.updateProfile,
    onSuccess: (data) => {
      // Update the current user cache
      queryClient.setQueryData(["currentUser"], (oldData) => ({
        ...oldData,
        user: { ...oldData.user, ...data.user },
      }))
    },
  })
}

export const useUploadAvatar = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: settingsApi.uploadAvatar,
    onSuccess: (data) => {
      queryClient.setQueryData(["currentUser"], (oldData) => ({
        ...oldData,
        user: { ...oldData.user, avatar: data.avatar },
      }))
    },
  })
}

export const useDeleteAvatar = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: settingsApi.deleteAvatar,
    onSuccess: () => {
      queryClient.setQueryData(["currentUser"], (oldData) => ({
        ...oldData,
        user: { ...oldData.user, avatar: null },
      }))
    },
  })
}

// Updated link hooks to work with individual operations
export const useFetchUserLinks = () => {
  return useQuery({
    queryKey: ["userLinks"],
    queryFn: settingsApi.getUserLinks,
  })
}

export const useAddLink = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: settingsApi.addLink,
    onSuccess: () => {
      // Invalidate and refetch user links
      queryClient.invalidateQueries({ queryKey: ["userLinks"] })
    },
  })
}

export const useUpdateLink = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, linkData }) => settingsApi.updateLink(id, linkData),
    onSuccess: () => {
      // Invalidate and refetch user links
      queryClient.invalidateQueries({ queryKey: ["userLinks"] })
    },
  })
}

export const useDeleteLink = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: settingsApi.deleteLink,
    onSuccess: () => {
      // Invalidate and refetch user links
      queryClient.invalidateQueries({ queryKey: ["userLinks"] })
    },
  })
}

export const useChangePassword = () => {
  return useMutation({
    mutationFn: settingsApi.updatePassword,
  })
}

export const useToggle2FA = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: settingsApi.toggle2FA,
    onSuccess: (data) => {
      queryClient.setQueryData(["currentUser"], (oldData) => ({
        ...oldData,
        user: { ...oldData.user, is_2fa_enabled: data.is_2fa_enabled },
      }))
    },
  })
}