"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  Clock,
  Calendar,
  Save,
  AlertCircle,
  CheckCircle,
  Users,
  FileText,
  Hash,
  Timer,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { useCreateService } from "../hooks/useServices";
import LoadingSpinner from "../ui/LoadingSpinner";
import FormField from "../features/Authenticaion/FormField";
import WeeklyAvailability from "../features/services/WeeklyAvailability";
import DateExceptions from "../features/services/DateExceptions";
import { transformFrontendData, structureAvailabilityExceptions } from "../utils/helpers";
import toast from "react-hot-toast";

export default function CreateServicePage() {
  const navigate = useNavigate();
  const { data: currentUser, status, isLoading: isLoadingAuth } = useAuth();
  const [activeTab, setActiveTab] = useState("basic");
  const [weeklyAvailability, setWeeklyAvailability] = useState({});
  const [dateExceptions, setDateExceptions] = useState([]);
  const [isServiceIdModified, setIsServiceIdModified] = useState(false);


  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm({
    defaultValues: {
      serviceId: "",
      type: "",
      description: "",
      sessionDuration: 30,
    },
  });

  const createServiceMutation = useCreateService();
  const serviceId = watch("serviceId");


  useEffect(() => {
  const subscription = watch((value, { name }) => {
    if (name !== "type") return;
    if (isServiceIdModified) return;

    const type = value?.type || "";

    const formatted = type
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .slice(0, 32);

    setValue("serviceId", formatted);
  });

  return () => subscription.unsubscribe();
}, [watch, setValue, isServiceIdModified]);
  
  const onSubmit = async (data) => {
    try {

      const serviceData = {
        id: data.serviceId,
        type: data.type,
        description: data.description,
        sessionTime: Number.parseInt(data.sessionDuration),
        days: transformFrontendData(weeklyAvailability),
        exceptions: structureAvailabilityExceptions(dateExceptions),
      };

      await createServiceMutation.mutateAsync(serviceData);
      toast.success("Service has been created successfully")
      navigate(`/my/services/${data.serviceId}`);
    } catch (error) {
      console.error("Service creation failed:", error);
    }
  };

  // Loading state
  if (isLoadingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  // Don't render if not authorized (will redirect)
  if (status !== "full" || currentUser?.user?.role !== "MENTOR") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Create New Service
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Set up a new mentoring service with your availability preferences
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab("basic")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "basic"
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Basic Information
                </div>
              </button>
              <button
                onClick={() => setActiveTab("availability")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "availability"
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
            {/* Basic Information Tab */}
            {activeTab === "basic" && (
              <div className="p-6 space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Service Details
                </h2>

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

                {/* Service ID */}
                <FormField
                label="Service ID"
                name="serviceId"
                register={register}
                error={errors.serviceId}
                rules={{
                  required: "Service ID is required",
                  pattern: {
                    value: /^[a-zA-Z0-9-]+$/,
                    message: "ID can only contain letters, numbers, and dashes",
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
                    {...register("serviceId", {
                      required: "Service ID is required",
                      pattern: {
                        value: /^[a-zA-Z0-9-]+$/,
                        message: "ID can only contain letters, numbers, and dashes",
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
                    onChange={(e) => {
                      setIsServiceIdModified(true); // track that user has edited the field
                      // let react-hook-form still handle the input
                      register("serviceId").onChange(e);
                    }}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="service-id"
                  />
                </div>
                {serviceId?.length > 0 && (<button
                  type="button"
                  onClick={() => {
                    const type = watch("type") || "";
                    const formatted = type
                      .toLowerCase()
                      .replace(/\s+/g, "-")
                      .replace(/[^a-z0-9-]/g, "")
                      .slice(0, 32);
                    setValue("serviceId", formatted);
                    setIsServiceIdModified(false); // resume auto-updating
                  }}
                  className="text-sm text-blue-500 hover:underline mt-2"
                >
                  Reset to auto-generated ID
                </button>
                )}
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  This will be used in URLs: /users/{currentUser?.user?.id}/services/{serviceId || "your-id"}/book
                </p>
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
                          message: "Description must be at least 20 characters",
                        },
                        maxLength: {
                          value: 300,
                          message: "Description must not exceed 300 characters",
                        },
                      })}
                      rows={4}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white resize-none"
                      placeholder="Describe what you'll cover in this service, what mentees can expect, and any prerequisites..."
                    />
                  </div>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {watch("description")?.length || 0}/300 characters
                  </p>
                </FormField>

                {/* Navigation */}
                <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={() => setActiveTab("availability")}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors flex items-center"
                  >
                    Next: Set Availability
                    <Calendar className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </div>
            )}

            {/* Availability Tab */}
            {activeTab === "availability" && (
              <div className="p-6 space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Set Your Availability
                  </h2>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Timezone:{" "}
                    {
                      /*Intl.DateTimeFormat().resolvedOptions().timeZone*/ currentUser
                        ?.user.timezone
                    }
                  </div>
                </div>

                {/* Weekly Availability */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Weekly Routine
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Set your regular weekly availability. This will be your
                    default schedule.
                  </p>
                  <WeeklyAvailability
                    availability={weeklyAvailability}
                    onChange={setWeeklyAvailability}
                    pageType="create"
                  />
                </div>

                {/* Date Exceptions */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Date-Specific Exceptions
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Override your weekly routine for specific dates (holidays,
                    special availability, etc.)
                  </p>
                  <DateExceptions
                    exceptions={dateExceptions}
                    onChange={setDateExceptions}
                  />
                </div>

                {/* Navigation */}
                <div className="flex justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={() => setActiveTab("basic")}
                    className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                  >
                    Back to Basic Info
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting || createServiceMutation.isPending}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-md transition-colors disabled:cursor-not-allowed flex items-center"
                  >
                    {isSubmitting || createServiceMutation.isPending ? (
                      <>
                        <LoadingSpinner size="sm" className="mr-2" />
                        Creating Service...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Create Service
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Success/Error Messages */}
            {createServiceMutation.isSuccess && (
              <div className="mx-6 mb-6 rounded-md bg-green-50 dark:bg-green-900/20 p-4">
                <div className="flex">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                  <div className="text-sm text-green-700 dark:text-green-400">
                    Service created successfully!
                  </div>
                </div>
              </div>
            )}

            {createServiceMutation.error && (
              <div className="mx-6 mb-6 rounded-md bg-red-50 dark:bg-red-900/20 p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-400 mr-3 flex-shrink-0" />
                  <div className="text-sm text-red-700 dark:text-red-400">
                    {createServiceMutation.error.message}
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
            Service Creation Tips
          </h3>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <li>
              • Choose a clear, descriptive service type that matches what you
              offer
            </li>
            <li>
              • Your service ID will be part of the URL, so keep it simple and
              professional
            </li>
            <li>
              • Write a detailed description to help mentees understand what
              they'll get
            </li>
            <li>
              • Set realistic availability that you can consistently maintain
            </li>
            <li>
              • You can always edit your service details and availability later
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
