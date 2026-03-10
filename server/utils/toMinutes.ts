export const useToMinutes = () => {
  //takes the shift duration of string like
  //starting from "17:30"
  // ending to "20:00"
  const shift_hours_to_minutes = (time: string) => {
    const [hoursPart, minutesPart] = time.split(":");
    const hours = Number(hoursPart);
    const minutes = Number(minutesPart);

    if (Number.isNaN(hours) || Number.isNaN(minutes)) {
      return 0;
    }

    return hours * 60 + minutes;
  };

  return {
    shift_hours_to_minutes,
  };
};
