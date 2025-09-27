"use client";
import { useState } from "react";
import { Plus, Trash2, Clock } from "lucide-react";
import TimeSlotEditor from "./TimeSlotEditor";
import {
  useAddSlot,
  useDeleteSlot,
  useUpdateSlot,
} from "../../hooks/useServices";
import { calculateDuration } from "../../utils/helpers";
import toast from "react-hot-toast";

const DAYS_OF_WEEK = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
];

export default function WeeklyAvailability({
  serviceId,
  availability,
  onChange,
  pageType,
}) {
  const [addingSlotForDay, setAddingSlotForDay] = useState(null);
  const [editingSlot, setEditingSlot] = useState(null); // { day, index }
  const addSlotMutation = useAddSlot(serviceId);
  const updateSlotMutation = useUpdateSlot(serviceId);
  const deleteSlotMutation = useDeleteSlot(serviceId);
  const handleAddTimeSlot = (day) => {
    setAddingSlotForDay(day);
    setEditingSlot(null);
  };

  const handleConfirmAddSlot = async (day, slot) => {
    try {
      let newAvailability;
      if (pageType === "create") {
        newAvailability = {
          ...availability,
          [day]: [...(availability[day] || []), { ...slot }],
        };
      } else {
        const data = await addSlotMutation.mutateAsync({
          dayOfWeek: day,
          startTime: slot.startTime,
          duration: calculateDuration(slot.startTime, slot.endTime),
        });
        toast.success("Slot has been added successfully")
        newAvailability = {
          ...availability,
          [day]: [
            ...(availability[day] || []),
            { ...slot, id: data.newAvailability.id },
          ],
        };
      }
      console.log("New availability after adding slot:", newAvailability);
      onChange(newAvailability);
      setAddingSlotForDay(null);
    } catch (error) {
      console.error("Error adding slot:", error);
      throw error; // Re-throw to let TimeSlotEditor handle the error feedback
    }
  };

  const handleCancelAddSlot = () => {
    setAddingSlotForDay(null);
  };

  const handleStartEditSlot = (day, index) => {
    setEditingSlot({ day, index });
    setAddingSlotForDay(null);
  };

  const handleConfirmEditSlot = async (slot) => {
    if (!editingSlot) return;

    const { day, index } = editingSlot;
    try {
      const newSlots = [...(availability[day] || [])];
      newSlots[index] = { ...newSlots[index], ...slot };
      const newAvailability = {
        ...availability,
        [day]: newSlots,
      };
      if (pageType === "manage") {
        const id = newSlots[index].id;
        await updateSlotMutation.mutateAsync({
          slotId: id,
          slotData: {
            startTime: slot.startTime,
            duration: calculateDuration(slot.startTime, slot.endTime),
          },
        });
        toast.success("Slot has been updated successfully")
      }
      onChange(newAvailability);
      setEditingSlot(null);
    } catch (error) {
      console.error("Error updating slot:", error);
      throw error; // Re-throw to let TimeSlotEditor handle the error feedback
    }
  };

  const handleCancelEditSlot = () => {
    setEditingSlot(null);
  };

  const removeTimeSlot = async (day, index) => {
    try{
      const newSlots = [...(availability[day] || [])];
      console.log("New slots: ", newSlots)
      const slotIdToRemove = newSlots[index]?.id;

      if (pageType === "manage") {
        await deleteSlotMutation.mutateAsync(slotIdToRemove);
        toast.success("Time slot has been deleted successfully");
      }

      newSlots.splice(index, 1);
      const newAvailability = {
        ...availability,
        [day]: newSlots.length > 0 ? newSlots : undefined,
      };
      if (newSlots.length === 0) {
        delete newAvailability[day];
      }
      onChange(newAvailability);
      setEditingSlot(null);
    } catch(error){
      if(pageType === "manage"){
        toast.error(`Failed to delete time slot: ${error.message}`)
      }
    }
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
              onClick={() => handleAddTimeSlot(day.key)}
              disabled={addingSlotForDay === day.key}
              className="inline-flex items-center px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Time Slot
            </button>
          </div>

          {availability[day.key]?.length > 0 ? (
            <div className="space-y-3">
              {availability[day.key].map((slot, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  {console.log("Editing slot:", slot)}
                  {editingSlot?.day === day.key &&
                  editingSlot?.index === index ? (
                    <TimeSlotEditor
                      slot={slot}
                      onConfirm={handleConfirmEditSlot}
                      onCancel={handleCancelEditSlot}
                      isEditing={true}
                    />
                  ) : (
                    <>
                      <TimeSlotEditor
                        slot={slot}
                        onStartEdit={() => handleStartEditSlot(day.key, index)}
                        showEditButton={true}
                      />
                      <button
                        type="button"
                        onClick={() => removeTimeSlot(day.key, index)}
                        className="p-2 text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors ml-auto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              ))}

              {/* Add new slot form */}
              {addingSlotForDay === day.key && (
                <div className="flex items-center gap-3 border-t border-gray-200 dark:border-gray-600 pt-3">
                  <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <TimeSlotEditor
                    onConfirm={(slot) => handleConfirmAddSlot(day.key, slot)}
                    onCancel={handleCancelAddSlot}
                    isEditing={true}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
                No availability set for {day.label}
              </div>

              {/* Add new slot form */}
              {addingSlotForDay === day.key && (
                <div className="flex items-center gap-3 border-t border-gray-200 dark:border-gray-600 pt-3">
                  <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <TimeSlotEditor
                    onConfirm={(slot) => handleConfirmAddSlot(day.key, slot)}
                    onCancel={handleCancelAddSlot}
                    isEditing={true}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
