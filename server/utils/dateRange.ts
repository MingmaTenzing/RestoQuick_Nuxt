export type DateRange = {
  start: Date;
  end: Date;
};

export const useDateRange = () => {
  const getDayRange = (): DateRange => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    return { start, end };
  };

  const getWeekRange = (): DateRange => {
    const start = new Date();
    const day = start.getDay();
    const diffToMonday = (day + 6) % 7;

    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - diffToMonday);

    const end = new Date(start);
    end.setDate(end.getDate() + 7);

    return { start, end };
  };

  const getNextWeekRange = (): DateRange => {
    const currentWeek = getWeekRange();
    const start = new Date(currentWeek.start);
    start.setDate(start.getDate() + 7);

    const end = new Date(start);
    end.setDate(end.getDate() + 7);

    return { start, end };
  };

  const getMonthRange = (): DateRange => {
    const baseDate = new Date();
    const start = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
    const end = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 1);

    return { start, end };
  };

  return {
    getMonthRange,
    getDayRange,
    getWeekRange,
    getNextWeekRange,
  };
};
