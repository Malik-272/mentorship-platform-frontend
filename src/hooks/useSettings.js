import { useMutation, useQueryClient } from "@tanstack/react-query"
import { settingsApi } from "../services/settingsApi"

// Custom hooks
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

export const useUpdateLinks = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: settingsApi.updateLinks,
    onSuccess: (data) => {
      queryClient.setQueryData(["currentUser"], (oldData) => ({
        ...oldData,
        user: { ...oldData.user, links: data.links },
      }))
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
