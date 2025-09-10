"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import {
  User,
  Calendar,
  ExternalLink,
  Shield,
  UserX,
  CheckCircle,
  X,
} from "lucide-react";
import LoadingSpinner from "../../ui/LoadingSpinner";
import ErrorMessage from "../../ui/ErrorMessage";
import { useBannedUsers, useUnbanUser } from "../../hooks/useBannedUsers";

const UnbanConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  user,
  isUnbanning,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Lift Ban
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              disabled={isUnbanning}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mb-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-gray-900 dark:text-white font-medium">
                  Are you sure you want to lift the ban for this user?
                </p>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-4">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                User: {user?.name}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                ID: {user?.id}
              </p>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400">
              This will restore the user's access to the platform and all its
              features.
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              disabled={isUnbanning}
              className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isUnbanning}
              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              {isUnbanning ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Lifting Ban...
                </>
              ) : (
                "Lift Ban"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function BannedUsersPage() {
  const [unbanModal, setUnbanModal] = useState({ isOpen: false, user: null });

  // API hooks
  const { data: bannedUsersData, isLoading, error, refetch } = useBannedUsers();

  const unbanUserMutation = useUnbanUser();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleUnbanUser = async (userId) => {
    try {
      await unbanUserMutation.mutateAsync(userId);
      setUnbanModal({ isOpen: false, user: null });
    } catch (error) {
      console.error("Error unbanning user:", error);
      alert(error.message || "Failed to unban user. Please try again.");
    }
  };

  const openUnbanModal = (user) => {
    setUnbanModal({ isOpen: true, user });
  };

  const closeUnbanModal = () => {
    if (!unbanUserMutation.isPending) {
      setUnbanModal({ isOpen: false, user: null });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorMessage message="Failed to load banned users" onRetry={refetch} />
      </div>
    );
  }

  const bannedUsers = bannedUsersData?.bannedUsers || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
            <UserX className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Banned Users Management
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Manage users who have been banned from accessing the platform
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mt-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                <UserX className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {bannedUsers.length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Total Banned Users
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Banned Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        {bannedUsers.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No Banned Users
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Great! There are no banned users at the moment.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Ban Reason
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Banned At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Banned By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {bannedUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <Link
                          to={`/profile/${user.id}`}
                          className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 mb-1"
                        >
                          <User className="w-4 h-4" />
                          {user.name}
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          ID: {user.id}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <p className="text-sm text-gray-900 dark:text-white break-words whitespace-normal">
                        {user.banReason}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <Calendar className="w-4 h-4" />
                        {formatDate(user.bannedAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        to={`/profile/${user.bannedBy}`}
                        className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
                      >
                        <Shield className="w-4 h-4" />
                        {user.bannedBy}
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => openUnbanModal(user)}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors text-sm font-medium"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Lift Ban
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Load More / Pagination info */}
      {bannedUsers.length > 0 && (
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing {bannedUsers.length} banned user
            {bannedUsers.length !== 1 ? "s" : ""}
          </p>
        </div>
      )}

      {/* Unban Confirmation Modal */}
      <UnbanConfirmationModal
        isOpen={unbanModal.isOpen}
        onClose={closeUnbanModal}
        onConfirm={() => handleUnbanUser(unbanModal.user?.id)}
        user={unbanModal.user}
        isUnbanning={unbanUserMutation.isPending}
      />
    </div>
  );
}
