"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Globe,
  FileText,
  Hash,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCreateCommunity, useGetMyCommunity } from "../hooks/useCommunities";
import FormField from "../features/Authenticaion/FormField";
import LoadingSpinner from "../ui/LoadingSpinner";

export default function CreateCommunityPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Check if user already has a community
  const { data: existingCommunity, isLoading: checkingExisting } =
    useGetMyCommunity();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      communityId: "",
      name: "",
      description: "",
    },
  });

  const createCommunityMutation = useCreateCommunity();

  // Redirect if user already has a community
  useEffect(() => {
    if (existingCommunity?.community && !checkingExisting) {
      navigate(`/communities/${existingCommunity?.community.id}`);
    }
  }, [existingCommunity, checkingExisting, navigate]);

  // Auto-generate community ID from name
  const watchName = watch("name");
  useEffect(() => {
    if (watchName) {
      const generatedId = watchName
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim()
        .substring(0, 32);
      setValue("communityId", generatedId);
    }
  }, [watchName, setValue]);


  const onSubmit = async (data) => {
    try {
      // Build plain JSON object
      const payload = {
        id: data.communityId,
        name: data.name,
        description: data.description,
      };

      // Use the correct mutation if it expects JSON
      const result = await createCommunityMutation.mutateAsync(payload);

      navigate(`/communities/${result.community.id}`);
    } catch (error) {
      console.error("Community creation failed:", error);
    }
  };

  if (checkingExisting) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Checking existing communities..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Create Your Community
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Build a space where mentors and mentees can connect and grow
            together
          </p>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            {/* Community Name */}
            <FormField
              label="Community Name"
              name="name"
              placeholder="Enter your community name"
              register={register}
              error={errors.name}
              rules={{
                required: "Community name is required",
                minLength: {
                  value: 3,
                  message: "Name must be at least 3 characters",
                },
                maxLength: {
                  value: 50,
                  message: "Name must not exceed 50 characters",
                },
              }}
            >
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  {...register("name", {
                    required: "Community name is required",
                    minLength: {
                      value: 3,
                      message: "Name must be at least 3 characters",
                    },
                    maxLength: {
                      value: 50,
                      message: "Name must not exceed 50 characters",
                    },
                  })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter your community name"
                />
              </div>
            </FormField>

            {/* Community ID (Auto-generated) */}
            <FormField
              label="Community ID"
              name="communityId"
              register={register}
              error={errors.communityId}
              rules={{
                required: "Community ID is required",
                pattern: {
                  value: /^[a-z0-9-]+$/,
                  message:
                    "ID can only contain lowercase letters, numbers, and hyphens",
                },
                minLength: {
                  value: 3,
                  message: "ID must be at least 3 characters",
                },
                maxLength: {
                  value: 32,
                  message: "ID must not exceed 32 characters",
                },
              }}
            >
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  {...register("communityId", {
                    required: "Community ID is required",
                    pattern: {
                      value: /^[a-z0-9-]+$/,
                      message:
                        "ID can only contain lowercase letters, numbers, and hyphens",
                    },
                    minLength: {
                      value: 3,
                      message: "ID must be at least 3 characters",
                    },
                    maxLength: {
                      value: 32,
                      message: "ID must not exceed 32 characters",
                    },
                  })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                  placeholder="community-id"
                />
              </div>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                This will be your community's unique URL:
                growtly.com/communities/{watch("communityId") || "your-id"}
              </p>
            </FormField>

            {/* Community Description */}
            <FormField
              label="Community Description"
              name="description"
              register={register}
              error={errors.description}
              rules={{
                required: "Community description is required",
                minLength: {
                  value: 20,
                  message: "Description must be at least 20 characters",
                },
                maxLength: {
                  value: 1000,
                  message: "Description must not exceed 1000 characters",
                },
              }}
            >
              <div className="relative">
                <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <textarea
                  {...register("description", {
                    required: "Community description is required",
                    minLength: {
                      value: 20,
                      message: "Description must be at least 20 characters",
                    },
                    maxLength: {
                      value: 1000,
                      message: "Description must not exceed 1000 characters",
                    },
                  })}
                  rows={4}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white resize-none"
                  placeholder="Describe your community's purpose, goals, and what members can expect..."
                />
              </div>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {watch("description")?.length || 0}/1000 characters
              </p>
            </FormField>

            {/* Community Guidelines Preview */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start">
                <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                    Community Guidelines
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Your community will follow Growtly's community guidelines.
                    You'll be able to add custom rules and moderate content
                    after creation.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting || createCommunityMutation.isPending}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-medium rounded-md transition-colors disabled:cursor-not-allowed flex items-center"
              >
                {isSubmitting || createCommunityMutation.isPending ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Creating Community...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Create Community
                  </>
                )}
              </button>
            </div>

            {/* Error Message */}
            {createCommunityMutation.error && (
              <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-400 mr-3 flex-shrink-0" />
                  <div className="text-sm text-red-700 dark:text-red-400">
                    {createCommunityMutation.error.message}
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Need Help?
          </h3>
          <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
            <p>
              • Choose a descriptive name that reflects your community's purpose
            </p>
            <p>
              • Write a clear description to help potential members understand
              what to expect
            </p>
            <p>
              • Upload an engaging image that represents your community's
              identity
            </p>
            <p>
              • Your community ID will be used in the URL and cannot be changed
              later
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
