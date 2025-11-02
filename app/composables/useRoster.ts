import { ref, computed } from "vue";
import type { Staff, Shift } from "../lib/roster-mockdata";
import { mockStaff } from "../lib/roster-mockdata";

export type ShiftType = "morning" | "evening";

interface ShiftTimes {
  morning: { start: string; end: string };
  evening: { start: string; end: string };
}

const DEFAULT_SHIFT_TIMES: ShiftTimes = {
  morning: { start: "06:00", end: "14:00" },
  evening: { start: "14:00", end: "22:00" },
};

export function useRoster() {
  const shifts = useState<Shift[]>("shifts", () => []);
  const staff = useState<Staff[]>("staff", () => mockStaff);

  const addShift = (staffId: string, date: Date, shiftType: ShiftType) => {
    const times = DEFAULT_SHIFT_TIMES[shiftType];
    const shift: Shift = {
      id: Math.random().toString(36).substr(2, 9),
      staffId,
      date: date.toISOString(),
      startTime: times.start,
      endTime: times.end,
      position: staff.value.find((s) => s.id === staffId)?.role || "",
    };
    shifts.value.push(shift);
  };

  const removeShift = (shiftId: string) => {
    shifts.value = shifts.value.filter((shift) => shift.id !== shiftId);
  };

  const getShiftsForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    return shifts.value.filter((shift) => shift.date.startsWith(dateStr!));
  };

  const getStaffMember = (staffId: string) => {
    return staff.value.find((s) => s.id === staffId);
  };

  return {
    shifts,
    staff,
    addShift,
    removeShift,
    getShiftsForDate,
    getStaffMember,
  };
}
