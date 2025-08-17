function durationToEndTime(startTime, duration) {
  const [hours, minutes] = startTime.split(":").map(Number);
  const startDate = new Date();
  startDate.setHours(hours, minutes, 0, 0);

  const endDate = new Date(startDate.getTime() + duration * 60000);
  return `${String(endDate.getHours()).padStart(2, "0")}:${String(
    endDate.getMinutes()
  ).padStart(2, "0")}`;
}

export function transformBackendData(days) {
  const safeDays = days || {};
  return Object.fromEntries(
    Object.entries(safeDays).map(([day, slots]) => [
      day,
      (slots || []).map((slot) => ({
        startTime: slot.startTime,
        endTime: durationToEndTime(slot.startTime, slot.duration),
        id: slot.id, // keep id if needed
      })),
    ])
  );
}

export function calculateDuration(startTime, endTime) {
  console.log(startTime, endTime);
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);
  const startTotal = startHour * 60 + startMinute;
  const endTotal = endHour * 60 + endMinute;
  return endTotal - startTotal;
}

export function transformFrontendData(availability) {
  const result = {};

  for (const [day, slots] of Object.entries(availability)) {
    result[day] = slots.map(({ startTime, endTime }) => ({
      startTime,
      duration: calculateDuration(startTime, endTime),
    }));
  }
  return result;
}
