import { ref, computed } from "vue";
import type { Shift, Staff } from "../lib/roster-mockdata";
import { mockStaff } from "../lib/roster-mockdata";

// export type ShiftType = "morning" | "evening";

// interface ShiftTimes {
//   morning: { start: string; end: string };
//   evening: { start: string; end: string };
// }

// const DEFAULT_SHIFT_TIMES: ShiftTimes = {
//   morning: { start: "06:00", end: "14:00" },
//   evening: { start: "14:00", end: "22:00" },
// };

// export function useRoster() {
//   const shifts = useState<Shift[]>("shifts", () => []);
//   const staff = useState<Staff[]>("staff", () => mockStaff);

//   const addShift = (staffId: string, date: Date, shiftType: ShiftType) => {
//     const times = DEFAULT_SHIFT_TIMES[shiftType];
//     const shift: Shift = {
//       id: Math.random().toString(36).substr(2, 9),
//       staffId,
//       date: date.toISOString(),
//       startTime: times.start,
//       endTime: times.end,
//       position: staff.value.find((s) => s.id === staffId)?.role || "",
//     };
//     shifts.value.push(shift);
//   };

//   const removeShift = (shiftId: string) => {
//     shifts.value = shifts.value.filter((shift) => shift.id !== shiftId);
//   };

//   const getShiftsForDate = (date: Date) => {
//     const dateStr = date.toISOString().split("T")[0];
//     return shifts.value.filter((shift) => shift.date.startsWith(dateStr!));
//   };

//   const getStaffMember = (staffId: string) => {
//     return staff.value.find((s) => s.id === staffId);
//   };

//   return {
//     shifts,
//     staff,
//     addShift,
//     removeShift,
//     getShiftsForDate,
//     getStaffMember,
//   };
// }

export const useRoster = () => {
  const shifts = useState<Shift[]>("shifts", () => []);

  function addShift(staff_id: string, shift_date: Date) {
    shifts.value.push({
      staffId: staff_id,
      id: Math.random().toString(36).slice(2),
      date: shift_date,
      startTime: "",
      endTime: "",
      position: "Kitchen", //for now demo purposes
    });
  }

  const edit_shift_time = (
    shift_id: string,
    updated_start_time: string,
    updated_end_time: string
  ) => {
    const find_shift = shifts.value.find((shift) => shift_id == shift.id);
    find_shift!.startTime = updated_start_time;
    find_shift!.endTime = updated_end_time;
  };

  const remove_shift = (shift_id: string) => {
    const removed_shift = shifts.value.filter((shift) => shift_id != shift.id);
    shifts.value = removed_shift;
  };

  return { shifts, addShift, edit_shift_time, remove_shift };
};
