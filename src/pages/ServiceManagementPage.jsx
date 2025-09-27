"use client";

import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  Save,
  AlertCircle,
  CheckCircle,
  Users,
  FileText,
  Timer,
  Calendar,
  Eye,
  EyeOff,
  Clock,
  Globe,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { useGetMyService, useUpdateService } from "../hooks/useServices";
import LoadingSpinner from "../ui/LoadingSpinner";
import ErrorMessage from "../ui/ErrorMessage";
import FormField from "../features/Authenticaion/FormField";
import WeeklyAvailability from "../features/services/WeeklyAvailability";
import DateExceptions from "../features/services/DateExceptions";
import ServicePreview from "../features/services/ServicePreview";
import { transformBackendData, transformFrontendData } from "../utils/helpers";
import toast from "react-hot-toast";

// Common timezones for preview
const COMMON_TIMEZONES = [
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "Europe/London", label: "London (GMT)" },
  { value: "Europe/Paris", label: "Paris (CET)" },
  { value: "Asia/Tokyo", label: "Tokyo (JST)" },
  { value: "Asia/Shanghai", label: "Shanghai (CST)" },
  { value: "Asia/Dubai", label: "Dubai (GST)" },
  { value: "Australia/Sydney", label: "Sydney (AEDT)" },
];
function transformExceptions(data) {
  return Object.entries(data).map(([date, slots]) => ({
    date,
    type: slots.length === 0 ? "unavailable" : "override",
    timeSlots: slots,
  }));
}
export default function ServiceManagementPage() {
  const navigate = useNavigate();
  const { id: serviceId } = useParams();
  const { data: currentUser, status, isLoading: isLoadingAuth } = useAuth();
  const [activeTab, setActiveTab] = useState("details");
  const [weeklyAvailability, setWeeklyAvailability] = useState({});
  const [dateExceptions, setDateExceptions] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [previewTimezone, setPreviewTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  // Check authentication and role
  useEffect(() => {
    if (!isLoadingAuth) {
      if (status === "none") {
        navigate("/login");
        return;
      }
      if (status === "partial") {
        navigate("/successful-registration");
        return;
      }
      if (currentUser?.user?.role !== "MENTOR") {
        navigate("/dashboard");
        return;
      }
    }
  }, [status, currentUser, isLoadingAuth, navigate]);

  // Fetch service data
  const {
    data: service,
    isLoading: isLoadingService,
    error: serviceError,
    refetch: refetchService,
  } = useGetMyService(serviceId);
  console.log("serviceData", service);

  // const service = serviceData?.data;
  console.log("service?.days:", service?.days);
  const transformedAvailability = transformBackendData(service?.days);
  console.log("transformedAvailability:", transformedAvailability);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
  } = useForm({
    defaultValues: {
      type: "",
      description: "",
      sessionDuration: 30,
    },
  });

  // Initialize form and availability when service data loads
  useEffect(() => {
    if (service) {
      reset({
        type: service.type || "",
        description: service.description || "",
        sessionDuration: service.sessionTime || 30,
      });

      setWeeklyAvailability(transformedAvailability || {});
      setDateExceptions(
        transformExceptions(transformBackendData(service.exceptions)) || []
      );
    }
  }, [service, reset]);

  const updateServiceMutation = useUpdateService();

  const onSubmit = async (data) => {
    try {
      const serviceData = {
        type: data.type,
        sessionTime: Number.parseInt(data.sessionDuration),
        description: data.description,
      };

      await updateServiceMutation.mutateAsync({
        serviceId: service.id,
        serviceData,
      });

      // Reset form dirty state
      reset(data);
      await refetchService();
    } catch (error) {
      console.error("Service update failed:", error);
    }
  };

  // Loading state
  if (isLoadingAuth || isLoadingService) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading service..." />
      </div>
    );
  }

  // Don't render if not authorized (will redirect)
  if (status !== "full" || currentUser?.user?.role !== "MENTOR") {
    return null;
  }

  // Service not found
  if (serviceError || !service) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <ErrorMessage
          title="Service Not Found"
          message={
            serviceError?.message ||
            "The service you're looking for doesn't exist or you don't have permission to access it."
          }
          showRetry={true}
          onRetry={() => refetchService()}
        />
      </div>
    );
  }

  const hasUnsavedChanges =
    isDirty ||
    JSON.stringify(weeklyAvailability) !==
    JSON.stringify(transformedAvailability || {}) ||
    JSON.stringify(
      transformFrontendData(
        dateExceptions.reduce((acc, { date, timeSlots }) => {
          if (date) acc[date] = timeSlots;
          return acc;
        }, {})
      )
    ) !== JSON.stringify(service.exceptions || []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-8 h-8 text-blue-600" />
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Manage Service: {service.id}
                </h1>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Update your service details and availability preferences
              </p>
            </div>

            {/* Preview Toggle */}
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${showPreview
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
            >
              {showPreview ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
              {showPreview ? "Hide Preview" : "Preview Service"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className={`${showPreview ? "lg:col-span-2" : "lg:col-span-3"}`}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              {/* Tab Navigation */}
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="flex space-x-8 px-6">
                  <button
                    onClick={() => setActiveTab("details")}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "details"
                      ? "border-blue-500 text-blue-600 dark:text-blue-400"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Service Details
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab("availability")}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "availability"
                      ? "border-blue-500 text-blue-600 dark:text-blue-400"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Availability
                    </div>
                  </button>
                </nav>
              </div>

              <form onSubmit={handleSubmit(onSubmit)}>
                {/* Service Details Tab */}
                {activeTab === "details" && (
                  <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Service Details
                      </h2>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Service ID:{" "}
                        <span className="font-mono">{service.id}</span>
                      </div>
                    </div>

                    {/* Service Type */}
                    <FormField
                      label="Service Type"
                      name="type"
                      register={register}
                      error={errors.type}
                      rules={{
                    required: "Service type is required",
                    maxLength: {
                      value: 50,
                      message: "Maximum 50 characters allowed",
                    },
                  }}
                    >
                      <input
                    type="text"
                    {...register("type", {
                      required: "Service type is required",
                      maxLength: {
                        value: 50,
                        message: "Maximum 50 characters allowed",
                      },
                    })}
                    maxLength={50}
                    placeholder="Enter a service type"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                    </FormField>

                    {/* Session Duration */}
                    <FormField
                      label="Session Duration (in minutes)"
                      name="sessionDuration"
                      register={register}
                      error={errors.sessionDuration}
                      rules={{
                      required: "Session duration is required",
                      min: {
                        value: 10,
                        message: "Minimum duration is 10 minutes",
                      },
                      max: {
                        value: 360,
                        message: "Maximum duration is 360 minutes",
                      },
                      validate: (value) =>
                        value % 5 === 0 || "Duration must be a multiple of 5",
                    }}
                    >
                      <div className="relative">
                        <Timer className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="number"
                          min={10}
                          max={360}
                          step={5}
                          {...register("sessionDuration", {
                            required: "Session duration is required",
                            min: {
                              value: 10,
                              message: "Minimum duration is 10 minutes",
                            },
                            max: {
                              value: 360,
                              message: "Maximum duration is 360 minutes",
                            },
                            validate: (value) =>
                              value % 5 === 0 || "Duration must be a multiple of 5",
                          })}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                          placeholder="e.g. 30"
                        />
                      </div>
                    </FormField>

                    {/* Description */}
                    <FormField
                      label="Service Description"
                      name="description"
                      register={register}
                      error={errors.description}
                      rules={{
                        required: "Service description is required",
                        minLength: {
                          value: 20,
                          message: "Description must be at least 20 characters",
                        },
                        maxLength: {
                          value: 300,
                          message: "Description must not exceed 300 characters",
                        },
                      }}
                    >
                      <div className="relative">
                        <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <textarea
                          {...register("description", {
                            required: "Service description is required",
                            minLength: {
                              value: 20,
                              message:
                                "Description must be at least 20 characters",
                            },
                            maxLength: {
                              value: 300,
                              message:
                                "Description must not exceed 300 characters",
                            },
                          })}
                          rows={4}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white resize-none"
                          placeholder="Describe what you'll cover in this service..."
                        />
                      </div>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {watch("description")?.length || 0}/300 characters
                      </p>
                    </FormField>
                  </div>
                )}

                {/* Availability Tab */}
                {activeTab === "availability" && (
                  <div className="p-6 space-y-8">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Manage Availability
                      </h2>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Timezone:{" "}
                        {service.timezone ||
                          // Intl.DateTimeFormat().resolvedOptions().timeZone
                          currentUser?.user.timezone}
                      </div>
                    </div>

                    {/* Weekly Availability */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                        <Clock className="w-5 h-5 mr-2" />
                        Weekly Routine
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Update your regular weekly availability.
                      </p>
                      <WeeklyAvailability
                        availability={weeklyAvailability}
                        onChange={setWeeklyAvailability}
                        serviceId={service.id}
                        pageType="manage"
                      />
                    </div>

                    {/* Date Exceptions */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                        <Calendar className="w-5 h-5 mr-2" />
                        Date-Specific Exceptions
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Override your weekly routine for specific dates.
                      </p>
                      <DateExceptions
                        exceptions={dateExceptions}
                        onChange={setDateExceptions}
                        pageType="manage"
                        serviceId={service.id}
                      />
                    </div>
                  </div>
                )}

                {/* Save Button */}
                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {hasUnsavedChanges && (
                        <span className="text-amber-600 dark:text-amber-400">
                          You have unsaved changes
                        </span>
                      )}
                    </div>
                    <button
                      type="submit"
                      disabled={
                        !hasUnsavedChanges || updateServiceMutation.isPending
                      }
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-md transition-colors disabled:cursor-not-allowed flex items-center"
                    >
                      {updateServiceMutation.isPending ? (
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
                </div>

                {/* Success/Error Messages */}
                {updateServiceMutation.isSuccess && (
                  <div className="mx-6 mb-6 rounded-md bg-green-50 dark:bg-green-900/20 p-4">
                    <div className="flex">
                      <CheckCircle className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                      <div className="text-sm text-green-700 dark:text-green-400">
                        Service updated successfully!
                      </div>
                    </div>
                  </div>
                )}

                {updateServiceMutation.error && (
                  <div className="mx-6 mb-6 rounded-md bg-red-50 dark:bg-red-900/20 p-4">
                    <div className="flex">
                      <AlertCircle className="h-5 w-5 text-red-400 mr-3 flex-shrink-0" />
                      <div className="text-sm text-red-700 dark:text-red-400">
                        {updateServiceMutation.error.message}
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Preview Panel */}
          {showPreview && (
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 sticky top-8">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Service Preview
                    </h3>
                    <Globe className="w-5 h-5 text-gray-400" />
                  </div>

                  {/* Timezone Selector */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      Preview in timezone:
                    </label>
                    <select
                      value={previewTimezone}
                      onChange={(e) => setPreviewTimezone(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                    >
                      <option
                        value={Intl.DateTimeFormat().resolvedOptions().timeZone}
                      >
                        Your timezone (
                        {Intl.DateTimeFormat().resolvedOptions().timeZone})
                      </option>
                      {COMMON_TIMEZONES.map((tz) => (
                        <option key={tz.value} value={tz.value}>
                          {tz.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="p-4">
                  <ServicePreview
                    service={{
                      ...service,
                      type: watch("type") || service.type,
                      description: watch("description") || service.description,
                      sessionDuration:
                        watch("sessionDuration") || service.sessionDuration,
                      weeklyAvailability,
                      dateExceptions,
                    }}
                    mentor={currentUser?.user}
                    previewTimezone={previewTimezone}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
