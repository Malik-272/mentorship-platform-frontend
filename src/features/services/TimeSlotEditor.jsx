"use client";

import { useState, useEffect, useRef } from "react";
import { Check, X, Edit2, Loader2, Moon } from "lucide-react";
import { set } from "react-hook-form";

const TIME_OPTIONS = [];
for (let hour = 0; hour < 24; hour++) {
  for (let minute = 0; minute < 60; minute += 15) {
    const timeString = `${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}`;
    TIME_OPTIONS.push(timeString);
  }
}

export default function TimeSlotEditor({
  slot = null, // null for adding new, object for editing existing
  onConfirm,
  onCancel,
  isEditing = false,
  showEditButton = false,
  onStartEdit = null,
}) {
  const [startTime, setStartTime] = useState(slot?.startTime || "09:00");
  const [endTime, setEndTime] = useState(slot?.endTime || "10:00");
  const [isInEditMode, setIsInEditMode] = useState(isEditing);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', message: string }
  const containerRef = useRef(null);
  const feedbackTimeoutRef = useRef(null);
  const [showEditButtonMode, setShowEditButtonMode] = useState(showEditButton);
  useEffect(() => {
    if (slot) {
      setStartTime(slot.startTime);
      setEndTime(slot.endTime);
    }
  }, [slot]);

  useEffect(() => {
    if (feedback) {
      feedbackTimeoutRef.current = setTimeout(() => {
        setFeedback(null);
      }, 3000);
    }
    return () => {
      if (feedbackTimeoutRef.current) {
        clearTimeout(feedbackTimeoutRef.current);
      }
    };
  }, [feedback]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isInEditMode) {
        handleCancel();
      }
    };

    const handleClickOutside = (e) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target) &&
        isInEditMode
      ) {
        handleCancel();
      }
    };

    if (isInEditMode) {
      document.addEventListener("keydown", handleEscape);
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isInEditMode]);

  const handleConfirm = async () => {
    setIsLoading(true);
    setFeedback(null);

    try {
      await onConfirm({ startTime, endTime });
      setIsInEditMode(false);
      setShowEditButtonMode(true);
      const action = slot ? "updated" : "added";
      setFeedback({
        type: "success",
        message: `Slot ${action} successfully`,
      });

      // Reset to defaults for new slot creation
      if (!slot) {
        setStartTime("09:00");
        setEndTime("10:00");
      }
    } catch (error) {
      console.error("Error saving slot:", error);
      setFeedback({
        type: "error",
        message: error.message || "Failed to save slot",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset to original values
    if (slot) {
      setStartTime(slot.startTime);
      setEndTime(slot.endTime);
    } else {
      setStartTime("09:00");
      setEndTime("10:00");
    }
    setIsInEditMode(false);
    setFeedback(null);
    onCancel();
  };

  const handleStartEdit = () => {
    setIsInEditMode(true);
    setFeedback(null);
    if (onStartEdit) {
      onStartEdit();
    }
  };

  const FeedbackMessage = () => {
    if (!feedback) return null;

    const bgColor =
      feedback.type === "success"
        ? "bg-green-100 dark:bg-green-900"
        : "bg-red-100 dark:bg-red-900";
    const textColor =
      feedback.type === "success"
        ? "text-green-800 dark:text-green-200"
        : "text-red-800 dark:text-red-200";

    return (
      <div
        className={`absolute top-full left-0 right-0 mt-2 p-2 rounded-md ${bgColor} ${textColor} text-sm z-10`}
      >
        {feedback.message}
      </div>
    );
  };

  // Display mode (for existing slots)
  if (!isInEditMode && slot) {
  const overflowsToNextDay = slot.endTime < slot.startTime;

  return (
    <div ref={containerRef} className="relative flex items-center gap-3">
      <span className="text-gray-700 dark:text-gray-300 flex items-center gap-1">
        {slot.startTime} - {slot.endTime}
        {overflowsToNextDay && (
          <span
            className="inline-flex items-center text-xs text-yellow-600 dark:text-yellow-300 ml-1"
            title="This time slot ends on the next day"
          >
            <Moon className="w-4 h-4" />
            <span className="ml-1">+1 day</span>
          </span>
        )}
      </span>

      {showEditButtonMode && (
        <button
          type="button"
          onClick={handleStartEdit}
          className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          title="Edit time slot"
        >
          <Edit2 className="w-4 h-4" />
        </button>
      )}

      <FeedbackMessage />
    </div>
  );
}

  // Edit/Add mode
  if (isInEditMode || (!slot && !showEditButton)) {
    return (
      <div ref={containerRef} className="relative flex items-center gap-3">
        <select
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          disabled={isLoading}
          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          autoFocus
        >
          {TIME_OPTIONS.map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>
        <span className="text-gray-500 dark:text-gray-400">to</span>
        <select
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          disabled={isLoading}
          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {TIME_OPTIONS.map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isLoading}
            className="p-2 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title={slot ? "Save changes" : "Add time slot"}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={isLoading}
            className="p-2 text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Cancel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <FeedbackMessage />
      </div>
    );
  }

  // Fallback (shouldn't reach here)
  return null;
}
