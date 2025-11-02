import { ref, computed } from "vue";

export function useWeekNavigation() {
  const currentDate = useState("currentDate", () => new Date());

  // Get the start of the week (Monday)
  const startOfWeek = computed(() => {
    const date = new Date(currentDate.value);
    const day = date.getDay();
    const diff = day === 0 ? 6 : day - 1; // Adjust diff to make Monday the start
    return new Date(date.setDate(date.getDate() - diff));
  });

  // Generate array of dates for the week
  const weekDates = computed(() => {
    const dates = [];
    const start = new Date(startOfWeek.value);

    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      dates.push({
        date,
        dayName: date.toLocaleDateString("en-US", { weekday: "short" }),
        dayNumber: date.getDate(),
        month: date.toLocaleDateString("en-US", { month: "short" }),
        isToday: isToday(date),
      });
    }
    return dates;
  });

  // Function to check if a date is today
  function isToday(date: Date): boolean {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  // Navigation functions
  function nextWeek() {
    const date = new Date(currentDate.value);
    date.setDate(date.getDate() + 7);
    currentDate.value = date;
  }

  function previousWeek() {
    const date = new Date(currentDate.value);
    date.setDate(date.getDate() - 7);
    currentDate.value = date;
  }

  function goToCurrentWeek() {
    currentDate.value = new Date();
  }

  // Get formatted week range (e.g., "Nov 1 - Nov 7")
  const weekRangeText = computed(() => {
    const start = weekDates.value[0];
    const end = weekDates.value[6];
    if (!start || !end) return "";
    return `${start.month} ${start.dayNumber} - ${end.month} ${end.dayNumber}`;
  });

  return {
    weekDates,
    weekRangeText,
    nextWeek,
    previousWeek,
    goToCurrentWeek,
  };
}
