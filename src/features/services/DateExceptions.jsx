"use client";

import { useState } from "react";
import { Plus, Trash2, Calendar, Clock, Edit2, Check, X } from "lucide-react";
import TimeSlotEditor from "./TimeSlotEditor";
import {
  useAddExceptionSlot,
  useRemoveExceptionSlot,
  useUpdateExceptionSlot,
} from "../../hooks/useServices";
import { calculateDuration } from "../../utils/helpers";

export default function DateExceptions({
  exceptions,
  onChange,
  pageType = "create", // "create" or "manage"
  serviceId,
}) {
  const [newException, setNewException] = useState({
    date: "",
    type: "override",
    timeSlots: [],
  });
  const [addingSlotToNewException, setAddingSlotToNewException] =
    useState(false);
  const [editingSlot, setEditingSlot] = useState(null); // { exceptionIndex, slotIndex }
  const [editingException, setEditingException] = useState(null); // exceptionIndex
  const [editingExceptionData, setEditingExceptionData] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [addingSlotToSelectedDate, setAddingSlotToSelectedDate] =
    useState(false);

  const addExceptionSlotMutation = useAddExceptionSlot(serviceId);
  const updateExceptionSlotMutation = useUpdateExceptionSlot(serviceId);
  const removeExceptionSlotMutation = useRemoveExceptionSlot(serviceId);

  const addException = () => {
    if (!newException.date) return;
    console.log("exceptions", exceptions);
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
    setAddingSlotToNewException(false);
  };

  const removeException = async (index) => {
    const exception = exceptions[index];

    // In manage mode, if removing the last slot, remove the entire date
    if (pageType === "manage" && exception.timeSlots.length > 0) {
      // Remove all slots for this date from backend
      for (const slot of exception.timeSlots) {
        if (slot.id) {
          try {
            await removeExceptionSlotMutation.mutateAsync(slot.id);
          } catch (error) {
            console.error("Error removing slot:", error);
          }
        }
      }
    }

    const updatedExceptions = [...exceptions];
    updatedExceptions.splice(index, 1);
    onChange(updatedExceptions);
    setEditingSlot(null);
    if (editingException === index) {
      setEditingException(null);
      setEditingExceptionData(null);
    }
  };

  const handleDateSelection = (date) => {
    setSelectedDate(date);
    setAddingSlotToSelectedDate(false);
    setEditingSlot(null);
  };

  const handleAddSlotToSelectedDate = async (slot) => {
    try {
      const data = await addExceptionSlotMutation.mutateAsync({
        date: selectedDate,
        startTime: slot.startTime,
        duration: calculateDuration(slot.startTime, slot.endTime),
      });

      // Find existing exception for this date or create new one
      const existingExceptionIndex = exceptions.findIndex(
        (ex) => ex.date === selectedDate
      );
      const updatedExceptions = [...exceptions];

      if (existingExceptionIndex >= 0) {
        // Add slot to existing exception
        updatedExceptions[existingExceptionIndex].timeSlots.push({
          ...slot,
          id: data.newAvailability.id,
        });
      } else {
        // Create new exception with this slot
        updatedExceptions.push({
          date: selectedDate,
          type: "override",
          timeSlots: [
            {
              ...slot,
              id: data.newAvailability.id,
            },
          ],
        });
      }

      onChange(updatedExceptions);
      setAddingSlotToSelectedDate(false);
    } catch (error) {
      console.error("Error adding slot to selected date:", error);
      throw error;
    }
  };

  const removeTimeSlotFromException = async (exceptionIndex, slotIndex) => {
    console.log("removeTimeSlotFromException");
    const exception = exceptions[exceptionIndex];
    const slot = exception.timeSlots[slotIndex];
    console.log(slot.id);
    // In manage mode, remove from backend
    if (pageType === "manage" && slot.id) {
      try {
        await removeExceptionSlotMutation.mutateAsync(slot.id);
      } catch (error) {
        console.error("Error removing slot:", error);
        return;
      }
    }

    const updatedExceptions = [...exceptions];
    updatedExceptions[exceptionIndex].timeSlots.splice(slotIndex, 1);

    if (
      pageType === "manage" &&
      updatedExceptions[exceptionIndex].timeSlots.length === 0
    ) {
      updatedExceptions.splice(exceptionIndex, 1);
    }

    onChange(updatedExceptions);
    setEditingSlot(null);
  };

  const startEditingException = (exceptionIndex) => {
    const exception = exceptions[exceptionIndex];
    setEditingException(exceptionIndex);
    setEditingExceptionData({
      date: exception.date,
      type: exception.type,
      timeSlots: [...exception.timeSlots],
    });
    setEditingSlot(null);
    setAddingSlotToNewException(false);
  };

  const cancelEditingException = () => {
    setEditingException(null);
    setEditingExceptionData(null);
  };

  const saveEditingException = () => {
    if (editingException === null || !editingExceptionData) return;

    const updatedExceptions = [...exceptions];
    updatedExceptions[editingException] = {
      ...editingExceptionData,
      timeSlots:
        editingExceptionData.type === "unavailable"
          ? []
          : editingExceptionData.timeSlots,
    };
    onChange(updatedExceptions);
    setEditingException(null);
    setEditingExceptionData(null);
  };

  const addTimeSlotToEditingException = () => {
    if (!editingExceptionData) return;

    const newSlot = { startTime: "09:00", endTime: "10:00" };
    setEditingExceptionData({
      ...editingExceptionData,
      timeSlots: [...editingExceptionData.timeSlots, newSlot],
    });
  };

  const removeTimeSlotFromEditingException = (slotIndex) => {
    console.log("removeTimeSlotFromEditingException");
    if (!editingExceptionData) return;

    const newTimeSlots = [...editingExceptionData.timeSlots];
    newTimeSlots.splice(slotIndex, 1);
    setEditingExceptionData({
      ...editingExceptionData,
      timeSlots: newTimeSlots,
    });
  };

  const updateTimeSlotInEditingException = (slotIndex, updatedSlot) => {
    if (!editingExceptionData) return;
    if (pageType === "manage") {
      const id = editingExceptionData.timeSlots[slotIndex]?.id;
      if (id) {
        updateExceptionSlotMutation.mutateAsync({
          slotId: id,
          slotData: {
            startTime: updatedSlot.startTime,
            duration: calculateDuration(
              updatedSlot.startTime,
              updatedSlot.endTime
            ),
          },
        });
      }
    }
    const newTimeSlots = [...editingExceptionData.timeSlots];
    newTimeSlots[slotIndex] = updatedSlot;
    setEditingExceptionData({
      ...editingExceptionData,
      timeSlots: newTimeSlots,
    });
  };

  const handleAddTimeSlotToNewException = () => {
    setAddingSlotToNewException(true);
    setEditingSlot(null);
  };

  const handleConfirmAddSlotToNewException = async (slot) => {
    try {
      let data;
      if (pageType === "manage") {
        data = await addExceptionSlotMutation.mutateAsync({
          date: newException.date,
          startTime: slot.startTime,
          duration: calculateDuration(slot.startTime, slot.endTime),
        });
      }
      console.log("Newly added slot:", data);
      setNewException({
        ...newException,
        timeSlots: [
          ...newException.timeSlots,
          {
            ...slot,
            id: pageType === "manage" ? data.newAvailability.id : undefined,
          },
        ],
      });
      setAddingSlotToNewException(false);
    } catch (error) {
      console.error("Error adding slot to new exception:", error);
      throw error;
    }
  };

  const handleCancelAddSlotToNewException = () => {
    setAddingSlotToNewException(false);
  };

  const handleStartEditSlot = (exceptionIndex, slotIndex) => {
    setEditingSlot({ exceptionIndex, slotIndex });
    setAddingSlotToNewException(false);
  };

  const handleConfirmEditSlot = async (slot) => {
    if (!editingSlot) return;

    const { exceptionIndex, slotIndex } = editingSlot;
    const exception = exceptions[exceptionIndex];
    const existingSlot = exception.timeSlots[slotIndex];

    try {
      // In manage mode, update the slot in backend
      if (pageType === "manage" && existingSlot.id) {
        await updateExceptionSlotMutation.mutateAsync({
          slotId: existingSlot.id,
          slotData: {
            startTime: slot.startTime,
            duration: calculateDuration(slot.startTime, slot.endTime),
          },
        });
      }

      const updatedExceptions = [...exceptions];
      updatedExceptions[exceptionIndex].timeSlots[slotIndex] = {
        ...slot,
        id: existingSlot.id, // Preserve the ID
      };
      onChange(updatedExceptions);
      setEditingSlot(null);
    } catch (error) {
      console.error("Error updating slot:", error);
      throw error;
    }
  };

  const handleCancelEditSlot = () => {
    setEditingSlot(null);
  };

  const removeTimeSlotFromNewException = async (index) => {
    console.log("removeTimeSlotFromNewException");
    const newTimeSlots = [...newException.timeSlots];

    newTimeSlots.splice(index, 1);
    setNewException({
      ...newException,
      timeSlots: newTimeSlots,
    });
    setEditingSlot(null);
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
      {pageType === "manage" && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
          <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
            Service Management Mode
          </h4>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            • Select a date first, then add slots one at a time • Edit and
            delete slots individually • Dates automatically disappear when the
            last slot is removed
          </p>
        </div>
      )}

      {pageType === "manage" && (
        <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
          <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
            Select Date to Manage
          </h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Choose Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => handleDateSelection(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            {selectedDate && (
              <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-medium text-gray-900 dark:text-white">
                    Manage slots for {formatDate(selectedDate)}
                  </h5>
                  <button
                    type="button"
                    onClick={() => setAddingSlotToSelectedDate(true)}
                    disabled={addingSlotToSelectedDate}
                    className="inline-flex items-center px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Slot
                  </button>
                </div>

                {/* Show existing slots for selected date */}
                {(() => {
                  const selectedDateException = exceptions.find(
                    (ex) => ex.date === selectedDate
                  );
                  return selectedDateException?.timeSlots.length > 0 ? (
                    <div className="space-y-2 mb-4">
                      {selectedDateException.timeSlots.map(
                        (slot, slotIndex) => {
                          const exceptionIndex = exceptions.findIndex(
                            (ex) => ex.date === selectedDate
                          );
                          return (
                            <div
                              key={slotIndex}
                              className="flex items-center gap-3 text-sm"
                            >
                              <Clock className="w-4 h-4 text-gray-400" />
                              {editingSlot?.exceptionIndex === exceptionIndex &&
                              editingSlot?.slotIndex === slotIndex ? (
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
                                    onStartEdit={() =>
                                      handleStartEditSlot(
                                        exceptionIndex,
                                        slotIndex
                                      )
                                    }
                                    showEditButton={true}
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeTimeSlotFromException(
                                        exceptionIndex,
                                        slotIndex
                                      )
                                    }
                                    className="p-2 text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors ml-auto"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                            </div>
                          );
                        }
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm mb-4">
                      No slots for this date yet
                    </div>
                  );
                })()}

                {/* Add new slot interface */}
                {addingSlotToSelectedDate && (
                  <div className="flex items-center gap-3 border-t border-gray-200 dark:border-gray-600 pt-3">
                    <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <TimeSlotEditor
                      onConfirm={handleAddSlotToSelectedDate}
                      onCancel={() => setAddingSlotToSelectedDate(false)}
                      isEditing={true}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Existing Exceptions - Modified for different page types */}
      {exceptions.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-md font-medium text-gray-900 dark:text-white">
            {pageType === "create"
              ? "Current Exceptions"
              : "All Date Exceptions"}
          </h4>
          {exceptions.map((exception, exceptionIndex) => (
            <div
              key={exceptionIndex}
              className="border border-gray-200 dark:border-gray-600 rounded-lg p-4"
            >
              {editingException === exceptionIndex ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-medium text-gray-900 dark:text-white">
                      Edit Exception
                    </h5>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={saveEditingException}
                        className="p-2 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors"
                        title="Save changes"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={cancelEditingException}
                        className="p-2 text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors"
                        title="Cancel editing"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {pageType === "create" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                        Date
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="date"
                          value={editingExceptionData.date}
                          onChange={(e) =>
                            setEditingExceptionData({
                              ...editingExceptionData,
                              date: e.target.value,
                            })
                          }
                          min={new Date().toISOString().split("T")[0]}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </div>
                  )}

                  {pageType === "create" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                        Exception Type
                      </label>
                      <select
                        value={editingExceptionData.type}
                        onChange={(e) =>
                          setEditingExceptionData({
                            ...editingExceptionData,
                            type: e.target.value,
                            timeSlots:
                              e.target.value === "unavailable"
                                ? []
                                : editingExceptionData.timeSlots,
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
                  )}

                  {(pageType === "create"
                    ? editingExceptionData.type === "override"
                    : true) && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                          Available Time Slots
                        </label>
                        {pageType === "create" && (
                          <button
                            type="button"
                            onClick={addTimeSlotToEditingException}
                            className="inline-flex items-center px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Add Time Slot
                          </button>
                        )}
                      </div>

                      {editingExceptionData.timeSlots.length > 0 ? (
                        <div className="space-y-3">
                          {editingExceptionData.timeSlots.map(
                            (slot, slotIndex) => (
                              <div
                                key={slotIndex}
                                className="flex items-center gap-3"
                              >
                                <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                {console.log(slot)}
                                <TimeSlotEditor
                                  slot={slot}
                                  onConfirm={(updatedSlot) =>
                                    updateTimeSlotInEditingException(
                                      slotIndex,
                                      updatedSlot
                                    )
                                  }
                                  onCancel={() => {}}
                                  isEditing={pageType === "create"}
                                  showEditButton={true}
                                />
                                {pageType === "create" && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeTimeSlotFromEditingException(
                                        slotIndex
                                      )
                                    }
                                    className="p-2 text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            )
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
                          No time slots added yet
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <>
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
                    <div className="flex items-center gap-1">
                      {pageType === "create" && (
                        <button
                          type="button"
                          onClick={() => startEditingException(exceptionIndex)}
                          className="p-2 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                          title="Edit exception"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => removeException(exceptionIndex)}
                        className="p-2 text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors"
                        title="Delete exception"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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

                            {editingSlot?.exceptionIndex === exceptionIndex &&
                            editingSlot?.slotIndex === slotIndex ? (
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
                                  onStartEdit={() =>
                                    handleStartEditSlot(
                                      exceptionIndex,
                                      slotIndex
                                    )
                                  }
                                  showEditButton={pageType === "manage"}
                                />
                                {pageType === "manage" && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeTimeSlotFromException(
                                        exceptionIndex,
                                        slotIndex
                                      )
                                    }
                                    className="p-2 text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors ml-auto"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {pageType === "create" && (
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
                {/* <option value="unavailable">Mark as unavailable</option> */}
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
                    onClick={handleAddTimeSlotToNewException}
                    disabled={addingSlotToNewException}
                    className="inline-flex items-center px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                        <TimeSlotEditor slot={slot} showEditButton={false} />
                        <button
                          type="button"
                          onClick={() => removeTimeSlotFromNewException(index)}
                          className="p-2 text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}

                    {addingSlotToNewException && (
                      <div className="flex items-center gap-3 border-t border-gray-200 dark:border-gray-600 pt-3">
                        <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <TimeSlotEditor
                          onConfirm={handleConfirmAddSlotToNewException}
                          onCancel={handleCancelAddSlotToNewException}
                          isEditing={true}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
                      No time slots added yet
                    </div>

                    {addingSlotToNewException && (
                      <div className="flex items-center gap-3 border-t border-gray-200 dark:border-gray-600 pt-3">
                        <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <TimeSlotEditor
                          onConfirm={handleConfirmAddSlotToNewException}
                          onCancel={handleCancelAddSlotToNewException}
                          isEditing={true}
                        />
                      </div>
                    )}
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
      )}
    </div>
  );
}
