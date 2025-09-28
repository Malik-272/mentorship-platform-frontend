

import { useState } from "react"
import { useSearchParams } from "react-router-dom"

import LoadingSpinner from "../../ui/LoadingSpinner"
import ErrorMessage from "../../ui/ErrorMessage"
import BanUserModal from "../../features/admin/userPreview/BanUserModal"
import UnbanUserModal from "../../features/admin/userPreview/UnbanUserModal"
import SearchForm from "../../features/admin/userPreview/SearchForm"
import UserActions from "../../features/admin/userPreview/UserActions"
import BasicInfo from "../../features/admin/userPreview/BasicInfo"
import UserLinks from "../../features/admin/userPreview/UserLinks"
import UserCommunities from "../../features/admin/userPreview/UserCommunities"
import SessionRequests from "../../features/admin/userPreview/SessionRequests"
import UserServices from "../../features/admin/userPreview/UserServices"
import CommunityOwnership from "../../features/admin/userPreview/CommunityOwnership"

import { useUserPreview, useBanUser, useUnbanUser } from "../../hooks/useUserPreview"
import toast from "react-hot-toast"

export default function UserPreviewPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchId, setSearchId] = useState(searchParams.get("id") || "")
  const [showBanModal, setShowBanModal] = useState(false)
  const [showUnbanModal, setShowUnbanModal] = useState(false)

  const userId = searchParams.get("id")

  const { data: user, isLoading, error } = useUserPreview(userId)
  const { mutate: banUser, isLoading: isBanning } = useBanUser()
  const { mutate: unbanUser, isLoading: isUnbanning } = useUnbanUser()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchId.trim()) {
      setSearchParams({ id: searchId.trim() })
    }
  }

  const handleBanUser = (banReason) => {
    if (user?.basicDetails?.role === "ADMIN") {
      console.warn("Attempt to ban another admin was prevented.")
      return
    }

    banUser(
      { userId, banReason },
      {
        onSuccess: () => {
          toast.success(`${user?.basicDetails?.id} has been banned successfully`);
          setShowBanModal(false);
        },
        onError: (err) => {
          console.error("Failed to ban user:", err);
          toast.error(`Failed to ban ${user?.basicDetails?.id}: ${err.message}`);
        },
      }
    )
  }

  const handleUnbanUser = () => {
    unbanUser(userId, {
      onSuccess: () => {
        setShowUnbanModal(false);
        toast.success(`${user?.basicDetails?.id} has been unbaned successfully`);
      },
      onError: (err) => {
        console.error("Failed to unban user:", err);
        toast.error(`Failed to unban ${user?.basicDetails?.id}: ${err.message}`);
      },
    })
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">User Preview</h1>
      </div>

      <SearchForm
        searchId={searchId}
        setSearchId={setSearchId}
        handleSearch={handleSearch}
      />

      {isLoading && (
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      )}

      {error && !isLoading && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <ErrorMessage message={error.message || "Something went wrong"} />
          </div>
        </div>
      )}

      {user && !isLoading && !error && (
        <div className="space-y-6">
          <UserActions
            user={user}
            isUnbanning={isUnbanning}
            isBanning={isBanning}
            setShowUnbanModal={setShowUnbanModal}
            setShowBanModal={setShowBanModal}
          />

          <BasicInfo user={user} />
          <UserLinks user={user} />
          <UserCommunities user={user} />

          {user.basicDetails.role === "MENTEE" && <SessionRequests user={user} />}

          {user.basicDetails.role === "MENTOR" && (
            <>
              <UserServices user={user} />
              <UserCommunities user={user} />
            </>
          )}

          {user.basicDetails.role === "COMMUNITY_MANAGER" && <CommunityOwnership user={user} />}
        </div>
      )}

      <BanUserModal
        isOpen={showBanModal}
        onClose={() => setShowBanModal(false)}
        onConfirm={handleBanUser}
        user={user}
      />

      <UnbanUserModal
        isOpen={showUnbanModal}
        onClose={() => setShowUnbanModal(false)}
        onConfirm={handleUnbanUser}
        user={user}
      />
    </div>
  )
}