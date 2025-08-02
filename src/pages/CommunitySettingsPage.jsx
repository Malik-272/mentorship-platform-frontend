import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  Camera,
  Upload,
  Trash2,
  Save,
  Users,
  FileText,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { useGetMyCommunity, useUpdateCommunity } from "../hooks/useCommunities";
import LoadingSpinner from "../ui/LoadingSpinner";
import ErrorMessage from "../ui/ErrorMessage";
import FormField from "../features/Authenticaion/FormField";

export default function CommunitySettingsPage() {
  const navigate = useNavigate();
  const { data: currentUser, status, isLoading: isLoadingAuth } = useAuth();
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [avatarHover, setAvatarHover] = useState(false);
  const [hasImageChanges, setHasImageChanges] = useState(false);

  // Check authentication and role
  //   useEffect(() => {
  //     if (!isLoadingAuth) {
  //       if (status === "none") {
  //         navigate("/login");
  //         return;
  //       }
  //       if (status === "partial") {
  //         navigate("/confirm-email");
  //         return;
  //       }
  //       if (currentUser?.user?.role !== "COMMUNITY_MANAGER") {
  //         navigate("/dashboard");
  //         return;
  //       }
  //     }
  //   }, [status, currentUser, isLoadingAuth, navigate]);

  // Fetch community data
  const {
    data: communityData,
    isLoading: isLoadingCommunity,
    error: communityError,
    refetch: refetchCommunity,
  } = useGetMyCommunity();

  // Redirect to create community if no community exists
  useEffect(() => {
    if (!isLoadingCommunity && !communityData?.community) {
      navigate("/communities/create");
    }
  }, [isLoadingCommunity, communityError, communityData, navigate]);

  const community = communityData?.community;

  // Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
    },
  });

  // Reset form when community data loads
  useEffect(() => {
    if (community) {
      reset({
        name: community.name || "",
        description: community.description || "",
      });
      setImagePreview(community.imageUrl || null);
    }
  }, [community, reset]);

  const updateCommunityMutation = useUpdateCommunity();

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size must be less than 5MB");
        return;
      }

      setImageFile(file);
      setHasImageChanges(true);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle image removal
  const handleImageRemove = () => {
    setImageFile(null);
    setImagePreview(null);
    setHasImageChanges(true);
  };

  // Form submission
  const onSubmit = async (data) => {
    try {
      // const formData = new FormData();

      // Add text fields
      // formData.append("name", data.name);
      // formData.append("description", data.description);
      const payload = {
        name: data.name,
        description: data.description,
      };
      // Add image if changed
      if (hasImageChanges) {
        if (imageFile) {
          //   formData.append("image", imageFile);
        } else if (!imagePreview) {
          // Image was removed
          //   formData.append("removeImage", "true");
        }
      }

      await updateCommunityMutation.mutateAsync(payload);

      // Reset form state
      reset(data);
      setHasImageChanges(false);
      setImageFile(null);

      // Refetch community data
      await refetchCommunity();
    } catch (error) {
      console.error("Community update failed:", error);
    }
  };

  // Loading states
  if (isLoadingAuth || isLoadingCommunity) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading community settings..." />
      </div>
    );
  }

  // Error state
  if (communityError) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <ErrorMessage
          title="Failed to Load Community"
          message={communityError.message}
          showRetry={true}
          onRetry={() => refetchCommunity()}
        />
      </div>
    );
  }

  // Don't render if no community (will redirect)
  if (!community) {
    return null;
  }

  const getInitials = (name) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Community Settings
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your community information and settings
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Community Image Section */}
          <div className="p-8 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Community Image
            </h2>

            <div className="flex flex-col items-center">
              <div
                className="relative group"
                onMouseEnter={() => setAvatarHover(true)}
                onMouseLeave={() => setAvatarHover(false)}
              >
                <div className="w-32 h-32 rounded-lg overflow-hidden bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold relative shadow-lg">
                  {imagePreview ? (
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt={community.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    getInitials(community.name)
                  )}

                  {/* Hover Overlay */}
                  {avatarHover && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <div className="flex space-x-2">
                        <label className="cursor-pointer p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors">
                          <Upload className="w-5 h-5 text-white" />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            disabled={updateCommunityMutation.isPending}
                          />
                        </label>
                        {imagePreview && (
                          <button
                            type="button"
                            onClick={handleImageRemove}
                            disabled={updateCommunityMutation.isPending}
                            className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors"
                          >
                            <Trash2 className="w-5 h-5 text-white" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Camera Icon */}
                <div className="absolute -bottom-2 -right-2 bg-purple-600 rounded-full p-2 shadow-lg">
                  <Camera className="w-4 h-4 text-white" />
                </div>
              </div>

              <div className="mt-4 text-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {community.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Hover over the image to update or remove it
                </p>
              </div>
            </div>
          </div>

          {/* Community Information Form */}
          <div className="p-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Community Information
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Community Name */}
              <FormField
                label="Community Name"
                name="name"
                register={register}
                error={errors.name}
                rules={{
                  required: "Community name is required",
                  minLength: {
                    value: 3,
                    message: "Name must be at least 3 characters",
                  },
                  maxLength: {
                    value: 100,
                    message: "Name must not exceed 100 characters",
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
                        value: 100,
                        message: "Name must not exceed 100 characters",
                      },
                    })}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter community name"
                  />
                </div>
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
                    value: 500,
                    message: "Description must not exceed 500 characters",
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
                        value: 500,
                        message: "Description must not exceed 500 characters",
                      },
                    })}
                    rows={4}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white resize-none"
                    placeholder="Describe your community's purpose and goals..."
                  />
                </div>
              </FormField>

              {/* Submit Button */}
              <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="submit"
                  disabled={
                    (!isDirty && !hasImageChanges) ||
                    updateCommunityMutation.isPending
                  }
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-medium rounded-md transition-colors disabled:cursor-not-allowed flex items-center"
                >
                  {updateCommunityMutation.isPending ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>

              {/* Success Message */}
              {updateCommunityMutation.isSuccess && (
                <div className="rounded-md bg-green-50 dark:bg-green-900/20 p-4">
                  <div className="flex">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                    <div className="text-sm text-green-700 dark:text-green-400">
                      Community settings updated successfully!
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {updateCommunityMutation.error && (
                <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-red-400 mr-3 flex-shrink-0" />
                    <div className="text-sm text-red-700 dark:text-red-400">
                      {updateCommunityMutation.error.message}
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
            Community Management Tips
          </h3>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <li>• Keep your community name clear and descriptive</li>
            <li>
              • Write a compelling description to attract the right members
            </li>
            <li>• Use a high-quality image that represents your community</li>
            <li>
              • Regularly update your community information to keep it fresh
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
