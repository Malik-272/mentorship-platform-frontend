import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import {
  Camera,
  Upload,
  Trash2,
  ExternalLink,
  Edit2,
  Plus,
  Tag,
} from "lucide-react";
import {
  useUpdateProfile,
  useUploadAvatar,
  useDeleteAvatar,
  useFetchUserLinks,
  useGetUserProfile,
} from "../../hooks/useSettings";
import { validationRules, countryCodes } from "../../data/authData";
import FormField from "../Authenticaion/FormField";
import LinksModal from "./LinksModal";
import { useAuth } from "../../context/AuthContext";

export default function PersonalInfoSection() {
  const {
    data: userLinksData,
    isLoading: linksLoading,
    refetch: refetchLinks,
    error: linksError,
  } = useFetchUserLinks();
  const [showLinksModal, setShowLinksModal] = useState(false);
  const [avatarHover, setAvatarHover] = useState(false);
  const { data } = useGetUserProfile(); // Assuming useUser hook fetches the current user data
  const { userState, refetch: refetchUser } = useAuth();
  const [user, setUser] = useState({ ...data?.user, ...userState });

  useEffect(() => {
    setUser({ ...data?.user, ...userState });
  }, [data, userState]);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    control,
  } = useForm({
    defaultValues: {
      name: user?.name || "",
      id: user?.id || "",
      email: user?.email || "",
      headline: user?.headline || "",
      bio: user?.bio || "",
      country: user?.country || "",
      skills: user?.skills || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "skills",
    control,
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user?.name || "",
        id: user?.id || "",
        email: user?.email || "",
        headline: user?.headline || "",
        bio: user?.bio || "",
        country: user?.country || "",
        skills: user?.skills || [],
      });
    }
  }, [user, reset]);

  const updateProfileMutation = useUpdateProfile();
  const uploadAvatarMutation = useUploadAvatar();
  const deleteAvatarMutation = useDeleteAvatar();

  const onSubmit = async (data) => {
    console.log("Submitting profile data:", data);
    try {
      const allowedFields = ["name", "headline", "bio", "country", "skills"];
      const filteredData = {};

      allowedFields.forEach((field) => {
        if (data[field]) {
          filteredData[field] = data[field];
        }
      });

      if (filteredData.skills) {
        filteredData.skills = filteredData.skills.filter(
          (skill) => skill.trim() !== ""
        );
      }

      await updateProfileMutation.mutateAsync(filteredData);
      await refetchUser();
      reset(data); // Reset form dirty state
    } catch (error) {
      console.error("Profile update failed:", error);
    }
  };

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("image", file);
      try {
        await uploadAvatarMutation.mutateAsync(formData);
        await refetchUser();
      } catch (error) {
        console.error("Avatar upload failed:", error);
      }
    }
  };

  const handleAvatarDelete = async () => {
    try {
      await deleteAvatarMutation.mutateAsync();
      await refetchUser();
    } catch (error) {
      console.error("Avatar delete failed:", error);
    }
  };

  const handleLinksModalClose = () => {
    setShowLinksModal(false);
    refetchLinks(); // Refresh links when modal closes
  };

  const getInitials = (name) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "mentor":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "mentee":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  const userLinks = userLinksData?.links || [];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Personal Information
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Update your profile information and manage your social links.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Avatar Section */}
        <div className="flex flex-col items-center">
          <div
            className="relative group"
            onMouseEnter={() => setAvatarHover(true)}
            onMouseLeave={() => setAvatarHover(false)}
          >
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold relative">
              {user?.imageUrl ? (
                <img
                  src={user.imageUrl || "/placeholder.svg"}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                getInitials(user?.name)
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
                        onChange={handleAvatarUpload}
                        className="hidden"
                        disabled={uploadAvatarMutation.isPending}
                      />
                    </label>
                    {user?.imageUrl && (
                      <button
                        type="button"
                        onClick={handleAvatarDelete}
                        disabled={deleteAvatarMutation.isPending}
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
            <div className="absolute -bottom-2 -right-2 bg-blue-600 rounded-full p-2 shadow-lg">
              <Camera className="w-4 h-4 text-white" />
            </div>
          </div>

          <div className="mt-4 text-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {user?.name}
            </h3>
            <div className="flex items-center justify-center mt-2">
              <span
                className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getRoleColor(
                  user?.role
                )}`}
              >
                {user?.role === "mentee" ? "Mentee" : "Mentor"}
              </span>
            </div>
          </div>

          {(uploadAvatarMutation.isPending ||
            deleteAvatarMutation.isPending) && (
            <div className="mt-2 text-sm text-blue-600 dark:text-blue-400">
              {uploadAvatarMutation.isPending ? "Uploading..." : "Deleting..."}
            </div>
          )}
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            defaultValue={user?.name}
            label="Full Name"
            name="name"
            register={register}
            error={errors.name}
            rules={validationRules.name}
          />

          <FormField
            disabled={true}
            defaultValue={user?.id}
            label="Username"
            name="id"
            register={register}
            error={errors.id}
            rules={validationRules.id}
            className="opacity-60"
          />

          <FormField
            defaultValue={user?.email}
            label="Email Address"
            name="email"
            type="email"
            register={register}
            error={errors.email}
            rules={validationRules.email}
            disabled={true}
            className="opacity-60"
          />

          <FormField
            defaultValue={user?.headline}
            label="Professional Headline"
            name="headline"
            register={register}
            error={errors.headline}
            rules={validationRules.headline}
          />

          <FormField
            defaultValue={user?.country}
            label="Country"
            name="country"
            register={register}
            error={errors.country}
            rules={validationRules.country}
          >
            <select
              {...register("country", validationRules.country)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">
                {countryCodes[user?.country] || "Select your country"}
              </option>
              {Object.entries(countryCodes).map(([key, country]) => (
                <option key={key} value={key}>
                  {country}
                </option>
              ))}
            </select>
          </FormField>

          <div className="md:col-span-2">
            <FormField
              defaultValue={user?.bio}
              label="Bio"
              name="bio"
              register={register}
              error={errors.bio}
              placeholder="Tell us about yourself..."
            >
              <textarea
                {...register("bio")}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white resize-none"
                placeholder="Tell us about yourself..."
              />
            </FormField>
          </div>
        </div>

        {/* Skills Section */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Skills
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Add your professional skills and expertise
              </p>
            </div>
            <button
              type="button"
              onClick={() => append("")}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Skill
            </button>
          </div>

          <div className="space-y-3">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2">
                <input
                  {...register(`skills.${index}`)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., JavaScript, React, UI Design"
                />
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="p-2 text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          {fields.length === 0 && (
            <div className="text-center py-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
              <Tag className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No skills added yet
              </p>
            </div>
          )}
        </div>

        {/* Social Links Section */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Social Links
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Add links to your social profiles and portfolio
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowLinksModal(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Manage Links
            </button>
          </div>

          {/* Display Current Links */}
          {linksLoading ? (
            <div className="text-center py-6">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Loading links...
              </div>
            </div>
          ) : linksError ? (
            <div className="text-center py-6 border-2 border-dashed border-red-300 dark:border-red-600 rounded-lg">
              <ExternalLink className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <p className="text-sm text-red-500 dark:text-red-400">
                Failed to load links: {linksError.message}
              </p>
            </div>
          ) : userLinks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {userLinks.slice(0, 4).map((link) => (
                <div
                  key={link.id}
                  className="flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700"
                >
                  <ExternalLink className="w-4 h-4 text-gray-400 mr-3 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {link.linkName}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {link.linkUrl}
                    </div>
                  </div>
                </div>
              ))}
              {userLinks.length > 4 && (
                <div className="flex items-center justify-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-sm text-gray-500 dark:text-gray-400">
                  +{userLinks.length - 4} more links
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
              <ExternalLink className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No social links added yet
              </p>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="submit"
            disabled={!isDirty || updateProfileMutation.isPending}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-md transition-colors disabled:cursor-not-allowed"
          >
            {updateProfileMutation.isPending ? "Updating..." : "Update Profile"}
          </button>
        </div>

        {/* Success/Error Messages */}
        {updateProfileMutation.isSuccess && (
          <div className="rounded-md bg-green-50 dark:bg-green-900/20 p-4">
            <div className="text-sm text-green-700 dark:text-green-400">
              Profile updated successfully!
            </div>
          </div>
        )}

        {updateProfileMutation.error && (
          <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
            <div className="text-sm text-red-700 dark:text-red-400">
              {updateProfileMutation.error.message}
            </div>
          </div>
        )}
      </form>

      {/* Links Modal */}
      {showLinksModal && (
        <LinksModal
          isOpen={showLinksModal}
          onClose={handleLinksModalClose}
          userLinks={userLinks}
          onRefresh={refetchLinks}
        />
      )}
    </div>
  );
}
