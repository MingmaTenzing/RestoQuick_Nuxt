import { ref, computed } from "vue";
import type { Shift, Staff } from "../lib/roster-mockdata";
import { mockStaff } from "../lib/roster-mockdata";

export const useRoster = () => {
  //states
  const shifts = useState<Shift[]>("shifts", () => [
    {
      staffId: "1",
      id: "s1",
      date: new Date("2025-11-03"),
      startTime: "09:00",
      endTime: "17:00",
      position: "Kitchen",
    },
    {
      staffId: "2",
      id: "s2",
      date: new Date("2025-11-03"),
      startTime: "10:00",
      endTime: "18:00",
      position: "Waiter",
    },
    {
      staffId: "3",
      id: "s3",
      date: new Date("2025-11-04"),
      startTime: "08:00",
      endTime: "16:00",
      position: "Barista",
    },
    {
      staffId: "1",
      id: "s4",
      date: new Date("2025-11-05"),
      startTime: "12:00",
      endTime: "20:00",
      position: "Kitchen",
    },
    {
      staffId: "2",
      id: "s5",
      date: new Date("2025-11-05"),
      startTime: "09:00",
      endTime: "17:00",
      position: "Waiter",
    },
    {
      staffId: "3",
      id: "s6",
      date: new Date("2025-11-06"),
      startTime: "10:00",
      endTime: "18:00",
      position: "Barista",
    },
    {
      staffId: "1",
      id: "s7",
      date: new Date("2025-11-07"),
      startTime: "08:30",
      endTime: "16:30",
      position: "Kitchen",
    },
    {
      staffId: "2",
      id: "s8",
      date: new Date("2025-11-08"),
      startTime: "11:00",
      endTime: "19:00",
      position: "Waiter",
    },
    {
      staffId: "3",
      id: "s9",
      date: new Date("2025-11-09"),
      startTime: "09:00",
      endTime: "17:00",
      position: "Barista",
    },
  ]);

  // methods for adding, editing and removing shifts
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

  return {
    shifts,
    addShift,
    edit_shift_time,
    remove_shift,
  };
};
