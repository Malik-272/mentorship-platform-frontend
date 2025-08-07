import { Plus, Trash2, Clock } from "lucide-react";
import { useEffect } from "react";

const DAYS_OF_WEEK = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
];

const TIME_OPTIONS = [];
for (let hour = 0; hour < 24; hour++) {
  for (let minute = 0; minute < 60; minute += 15) {
    const timeString = `${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}`;
    TIME_OPTIONS.push(timeString);
  }
}

export default function WeeklyAvailability({ availability, onChange }) {
  useEffect(() => {
    console.log("Availability changed:", availability);
  }, [availability]);
  const addTimeSlot = (day) => {
    console.log("Adding time slot for day:", day);
    const newAvailability = {
      ...availability,
      [day]: [
        ...(availability[day] || []),
        { startTime: "09:00", endTime: "10:00" },
      ],
    };
    onChange(newAvailability);
  };

  const removeTimeSlot = (day, index) => {
    const newSlots = [...(availability[day] || [])];
    newSlots.splice(index, 1);
    const newAvailability = {
      ...availability,
      [day]: newSlots.length > 0 ? newSlots : undefined,
    };
    if (newSlots.length === 0) {
      delete newAvailability[day];
    }
    onChange(newAvailability);
  };

  const updateTimeSlot = (day, index, field, value) => {
    const newSlots = [...(availability[day] || [])];
    newSlots[index] = { ...newSlots[index], [field]: value };
    const newAvailability = {
      ...availability,
      [day]: newSlots,
    };
    onChange(newAvailability);
  };

  return (
    <div className="space-y-6">
      {DAYS_OF_WEEK.map((day) => (
        <div
          key={day.key}
          className="border border-gray-200 dark:border-gray-600 rounded-lg p-4"
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white">
              {day.label}
            </h4>
            <button
              type="button"
              onClick={() => addTimeSlot(day.key)}
              className="inline-flex items-center px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Time Slot
            </button>
          </div>

          {availability[day?.key]?.length > 0 ? (
            <div className="space-y-3">
              {availability[day?.key].map((slot, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <select
                    value={slot.startTime}
                    onChange={(e) =>
                      updateTimeSlot(
                        day.key,
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
                  <span className="text-gray-500 dark:text-gray-400">to</span>
                  <select
                    value={slot.endTime}
                    onChange={(e) =>
                      updateTimeSlot(day.key, index, "endTime", e.target.value)
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
                    onClick={() => removeTimeSlot(day.key, index)}
                    className="p-2 text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
              No availability set for {day.label}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
