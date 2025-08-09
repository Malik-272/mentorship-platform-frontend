"use client";

import { useState } from "react";
import { Clock, Calendar, User, MapPin, Star, Timer } from "lucide-react";

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

const DAYS_OF_WEEK = [
  { key: "monday", label: "Mon" },
  { key: "tuesday", label: "Tue" },
  { key: "wednesday", label: "Wed" },
  { key: "thursday", label: "Thu" },
  { key: "friday", label: "Fri" },
  { key: "saturday", label: "Sat" },
  { key: "sunday", label: "Sun" },
];

export default function ServicePreview({ service, mentor, previewTimezone }) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Convert time from service timezone to preview timezone
  const convertTime = (timeString, fromTimezone, toTimezone) => {
    if (fromTimezone === toTimezone) return timeString;

    try {
      const [hours, minutes] = timeString.split(":").map(Number);
      const date = new Date();
      date.setHours(hours, minutes, 0, 0);

      // Create a date in the service timezone
      const serviceTime = new Date(
        date.toLocaleString("en-US", { timeZone: fromTimezone })
      );

      // Convert to preview timezone
      const previewTime = new Date(
        serviceTime.toLocaleString("en-US", { timeZone: toTimezone })
      );

      return previewTime.toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return timeString; // Fallback to original time if conversion fails
    }
  };

  const getInitials = (name) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDuration = (minutes) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0
      ? `${hours}h ${remainingMinutes}m`
      : `${hours}h`;
  };

  // Get available time slots for preview
  const getAvailableSlots = () => {
    const slots = [];
    const serviceTimezone =
      service.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Add weekly availability slots
    DAYS_OF_WEEK.forEach((day) => {
      const daySlots = service.weeklyAvailability?.[day.key] || [];
      daySlots.forEach((slot) => {
        slots.push({
          day: day.label,
          startTime: convertTime(
            slot.startTime,
            serviceTimezone,
            previewTimezone
          ),
          endTime: convertTime(slot.endTime, serviceTimezone, previewTimezone),
          type: "weekly",
        });
      });
    });

    return slots.slice(0, 6); // Show first 6 slots for preview
  };

  const availableSlots = getAvailableSlots();

  return (
    <div className="space-y-6">
      {/* Service Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-lg font-bold mx-auto mb-4">
          {mentor?.imageUrl ? (
            <img
              src={mentor.imageUrl || "/placeholder.svg"}
              alt={mentor.name}
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            getInitials(mentor?.name)
          )}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
          {SERVICE_TYPE_LABELS[service.type] || service.type}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          with {mentor?.name}
        </p>
      </div>

      {/* Service Details */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Timer className="w-4 h-4" />
          <span>{formatDuration(service.sessionDuration)}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <MapPin className="w-4 h-4" />
          <span>Online Session</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Star className="w-4 h-4 text-yellow-500" />
          <span>4.9 (127 reviews)</span>
        </div>
      </div>

      {/* Description */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
          About this session
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          {service.description}
        </p>
      </div>

      {/* Availability Preview */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Available Times
          {previewTimezone !==
            (service.timezone ||
              Intl.DateTimeFormat().resolvedOptions().timeZone) && (
            <span className="text-xs text-blue-600 dark:text-blue-400">
              (in {previewTimezone.split("/")[1]?.replace("_", " ")})
            </span>
          )}
        </h4>

        {availableSlots.length > 0 ? (
          <div className="space-y-2">
            {availableSlots.map((slot, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 border border-gray-200 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-3 h-3 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {slot.day}
                  </span>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {slot.startTime} - {slot.endTime}
                </span>
              </div>
            ))}

            {service.weeklyAvailability &&
              Object.keys(service.weeklyAvailability).length > 0 && (
                <div className="text-center pt-2">
                  <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                    View all available times
                  </button>
                </div>
              )}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
            No availability set yet
          </div>
        )}
      </div>

      {/* Book Button */}
      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors">
        Book Session
      </button>

      {/* Timezone Note */}
      {previewTimezone !==
        (service.timezone ||
          Intl.DateTimeFormat().resolvedOptions().timeZone) && (
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md">
          Times shown in {previewTimezone.split("/")[1]?.replace("_", " ")}{" "}
          timezone
        </div>
      )}
    </div>
  );
}
