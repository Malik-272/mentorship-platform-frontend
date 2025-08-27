"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, data } from "react-router-dom";
import {
  Calendar,
  Clock,
  User,
  ArrowLeft,
  Send,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useBookSession, useGetService } from "../hooks/useServices";
import { authApi } from "../services/authApi";
import LoadingSpinner from "../ui/LoadingSpinner";
import CalendarComponent from "../ui/Calendar";

const SERVICE_TYPE_LABELS = {
  career_guidance: "Career Guidance",
  mock_interview: "Mock Interview",
  resume_review: "Resume Review",
  skill_development: "Skill Development",
  networking: "Networking Advice",
  industry_insights: "Industry Insights",
  leadership_coaching: "Leadership Coaching",
  startup_advice: "Startup Advice",
  other: "Other",
};

export default function ServiceBookingPage() {
  const { userId: mentorId, serviceId } = useParams();
  const navigate = useNavigate();
  const { data: currentUser, status, isLoading: isLoadingAuth } = useAuth();

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [agenda, setAgenda] = useState("");
  const [availableDates, setAvailableDates] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [mentor, setMentor] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error'
  const [submitMessage, setSubmitMessage] = useState("");
  const bookSessionMutation = useBookSession(mentorId, serviceId);

  // Fetch service data
  const {
    data: serviceData,
    isLoading: isLoadingService,
    error: serviceError,
    refetch: refetchService,
  } = useGetService(mentorId, serviceId);
  const service = serviceData?.service;
  const slotsData = serviceData?.slots;
  // Check authentication and role on mount
  useEffect(() => {
    if (!isLoadingAuth) {
      if (status === "none") {
        navigate("/login");
        return;
      }
      if (status === "partial") {
        navigate("/confirm-email");
        return;
      }
      if (currentUser?.user?.role !== "MENTEE") {
        navigate("/dashboard");
        return;
      }
    }
  }, [status, currentUser, isLoadingAuth, navigate]);
  const generateAvailableDates = useCallback(() => {
    if (!slotsData) return;

    const dates = [];
    console.log("slotsData", slotsData);
    // Get dates that have available slots
    Object.keys(slotsData).forEach((dateString) => {
      const date = new Date(dateString);
      const today = new Date();

      // Only include future dates within next 30 days
      if (
        date >= today &&
        date <= new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
      ) {
        if (slotsData[dateString] && slotsData[dateString].length > 0) {
          dates.push(date);
        }
      }
    });

    // Sort dates chronologically
    dates.sort((a, b) => a - b);
    console.log("dates", dates);
    setAvailableDates(dates);
  }, [slotsData]);
  // Fetch mentor data when service loads
  useEffect(() => {
    const fetchMentor = async () => {
      if (service?.mentorId) {
        try {
          const mentorData = await authApi.getUser(service.mentorId);
          setMentor(mentorData?.user);
        } catch (error) {
          console.error("Error fetching mentor:", error);
        }
      }
    };

    if (service) {
      fetchMentor();
      generateAvailableDates();
    }
  }, [service, slotsData, generateAvailableDates]);

  // Get available slots for selected date
  const getAvailableSlotsForDate = (date) => {
    if (!slotsData || !date) return [];

    const d = date instanceof Date ? date : new Date(date);
    const dateString = d.toLocaleDateString("en-CA");

    return slotsData[dateString] || [];
  };

  // Handle date selection
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    setAgenda("");

    const slots = getAvailableSlotsForDate(date);
    setAvailableSlots(slots);
  };

  // Handle slot selection
  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
  };

  // Handle booking submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDate || !selectedSlot || !agenda.trim()) {
      setSubmitStatus("error");
      setSubmitMessage(
        "Please select a date, time slot, and provide an agenda."
      );
      setTimeout(() => {
        setSubmitStatus(null);
        setSubmitMessage("");
      }, 3000);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      console.log("selectedDate", selectedDate);
      const result = await bookSessionMutation.mutateAsync({
        date: selectedDate.toLocaleDateString("en-CA"),
        startTime: selectedSlot,
        agenda,
      });

      setSubmitStatus("success");
      setSubmitMessage(result.message || "Session booked successfully!");
      setTimeout(() => {
        setSubmitStatus(null);
        setSubmitMessage("");
      }, 3000);
      setSelectedDate(null);
      refetchService();
      // Reset form after successful booking
      // setTimeout(() => {
      //   navigate(`/profile/${mentorId}`);
      // }, 3000);
    } catch (error) {
      console.error("Booking error:", error);
      setSubmitStatus("error");
      setSubmitMessage(error.message || "Failed to book session");
      setTimeout(() => {
        setSubmitStatus(null);
        setSubmitMessage("");
      }, 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading states
  if (isLoadingAuth || isLoadingService) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  // Error states
  if (serviceError) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Service Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The requested service could not be found or you don't have
            permission to access it.
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Don't render if not authorized
  if (status !== "full" || currentUser?.user?.role !== "MENTEE") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(`/profile/${mentorId}`)}
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Profile
          </button>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-lg font-bold">
              {mentor?.imageUrl ? (
                <img
                  src={mentor.imageUrl || "/placeholder.svg"}
                  alt={mentor.name}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                mentor?.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Book {SERVICE_TYPE_LABELS[service?.type] || service?.type}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                with {mentor?.name}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Calendar and Time Selection */}
          <div className="space-y-6">
            {/* Calendar */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Select Date
              </h2>

              <CalendarComponent
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
                availableDates={availableDates}
                className="w-full"
              />

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                Blue dates have available time slots
              </p>
            </div>

            {/* Time Slots */}
            {selectedDate && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Available Times
                </h2>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {selectedDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>

                {availableSlots.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {availableSlots.map((timeSlot, index) => (
                      <button
                        key={index}
                        onClick={() => handleSlotSelect(timeSlot)}
                        className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                          selectedSlot === timeSlot
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                        }`}
                      >
                        {timeSlot}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No available time slots for this date
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Session Details and Booking Form */}
          <div className="space-y-6">
            {/* Service Details */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Session Details
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-300">
                    Mentor: {mentor?.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-300">
                    Duration: {service?.sessionTime || 30} minutes
                  </span>
                </div>
              </div>

              {service?.description && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                    About this session
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              )}
            </div>

            {/* Booking Form */}
            {selectedDate && selectedSlot && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Session Agenda
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      What would you like to discuss in this session? *
                    </label>
                    <textarea
                      value={agenda}
                      onChange={(e) => setAgenda(e.target.value)}
                      rows={6}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white resize-none"
                      placeholder="Please provide details about what you'd like to cover, any specific questions you have, or goals for this session..."
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {agenda.length}/500 characters
                    </p>
                  </div>

                  {/* Booking Summary */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                      Booking Summary
                    </h3>
                    <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                      <div>
                        Date: {selectedDate.toLocaleDateString("en-CA")}
                      </div>
                      <div>Time: {selectedSlot}</div>
                      <div>Duration: {service?.sessionTime || 30} minutes</div>
                      <div>Mentor: {mentor?.name}</div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || !agenda.trim()}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <LoadingSpinner size="sm" className="mr-2" />
                        Booking Session...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Book Session
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* Status Messages */}
            {submitStatus && (
              <div
                className={`rounded-md p-4 ${
                  submitStatus === "success"
                    ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                    : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                }`}
              >
                <div className="flex">
                  {submitStatus === "success" ? (
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-400 mr-3 flex-shrink-0" />
                  )}
                  <div
                    className={`text-sm ${
                      submitStatus === "success"
                        ? "text-green-700 dark:text-green-400"
                        : "text-red-700 dark:text-red-400"
                    }`}
                  >
                    {submitMessage}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
