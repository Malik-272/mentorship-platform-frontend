"use client";

import { useState } from "react";
import { Plus, Trash2, Calendar, Clock } from "lucide-react";

const TIME_OPTIONS = [];
for (let hour = 0; hour < 24; hour++) {
  for (let minute = 0; minute < 60; minute += 15) {
    const timeString = `${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}`;
    TIME_OPTIONS.push(timeString);
  }
}

export default function DateExceptions({ exceptions, onChange }) {
  const [newException, setNewException] = useState({
    date: "",
    type: "override", // 'override' or 'unavailable'
    timeSlots: [],
  });

  const addException = () => {
    if (!newException.date) return;

    const updatedExceptions = [
      ...exceptions,
      {
        ...newException,
        timeSlots:
          newException.type === "unavailable" ? [] : newException.timeSlots,
      },
    ];
    onChange(updatedExceptions);
    setNewException({
      date: "",
      type: "override",
      timeSlots: [],
    });
  };

  const removeException = (index) => {
    const updatedExceptions = [...exceptions];
    updatedExceptions.splice(index, 1);
    onChange(updatedExceptions);
  };

  const addTimeSlotToNewException = () => {
    setNewException({
      ...newException,
      timeSlots: [
        ...newException.timeSlots,
        { startTime: "09:00", endTime: "10:00" },
      ],
    });
  };

  const removeTimeSlotFromNewException = (index) => {
    const newTimeSlots = [...newException.timeSlots];
    newTimeSlots.splice(index, 1);
    setNewException({
      ...newException,
      timeSlots: newTimeSlots,
    });
  };

  const updateTimeSlotInNewException = (index, field, value) => {
    const newTimeSlots = [...newException.timeSlots];
    newTimeSlots[index] = { ...newTimeSlots[index], [field]: value };
    setNewException({
      ...newException,
      timeSlots: newTimeSlots,
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Existing Exceptions */}
      {exceptions.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-md font-medium text-gray-900 dark:text-white">
            Current Exceptions
          </h4>
          {exceptions.map((exception, index) => (
            <div
              key={index}
              className="border border-gray-200 dark:border-gray-600 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {formatDate(exception.date)}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {exception.type === "unavailable"
                      ? "Unavailable"
                      : "Custom availability"}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeException(index)}
                  className="p-2 text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {exception.type === "override" &&
                exception.timeSlots.length > 0 && (
                  <div className="space-y-2">
                    {exception.timeSlots.map((slot, slotIndex) => (
                      <div
                        key={slotIndex}
                        className="flex items-center gap-3 text-sm"
                      >
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700 dark:text-gray-300">
                          {slot.startTime} - {slot.endTime}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          ))}
        </div>
      )}

      {/* Add New Exception */}
      <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
        <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
          Add Date Exception
        </h4>

        <div className="space-y-4">
          {/* Date Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={newException.date}
                onChange={(e) =>
                  setNewException({ ...newException, date: e.target.value })
                }
                min={new Date().toISOString().split("T")[0]}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Exception Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Exception Type
            </label>
            <select
              value={newException.type}
              onChange={(e) =>
                setNewException({
                  ...newException,
                  type: e.target.value,
                  timeSlots:
                    e.target.value === "unavailable"
                      ? []
                      : newException.timeSlots,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="override">
                Override with custom availability
              </option>
              <option value="unavailable">Mark as unavailable</option>
            </select>
          </div>

          {/* Time Slots for Override */}
          {newException.type === "override" && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Available Time Slots
                </label>
                <button
                  type="button"
                  onClick={addTimeSlotToNewException}
                  className="inline-flex items-center px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Time Slot
                </button>
              </div>

              {newException.timeSlots.length > 0 ? (
                <div className="space-y-3">
                  {newException.timeSlots.map((slot, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <select
                        value={slot.startTime}
                        onChange={(e) =>
                          updateTimeSlotInNewException(
                            index,
                            "startTime",
                            e.target.value
                          )
                        }
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                      >
                        {TIME_OPTIONS.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                      <span className="text-gray-500 dark:text-gray-400">
                        to
                      </span>
                      <select
                        value={slot.endTime}
                        onChange={(e) =>
                          updateTimeSlotInNewException(
                            index,
                            "endTime",
                            e.target.value
                          )
                        }
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                      >
                        {TIME_OPTIONS.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => removeTimeSlotFromNewException(index)}
                        className="p-2 text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
                  No time slots added yet
                </div>
              )}
            </div>
          )}

          {/* Add Button */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={addException}
              disabled={!newException.date}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-md transition-colors disabled:cursor-not-allowed"
            >
              Add Exception
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
