export default defineEventHandler(async () => {
  const prisma = usePrisma();
  const { shift_hours_to_minutes } = useToMinutes();
  const { getWeekRange, getDayRange } = useDateRange();
  const weekRange = getWeekRange();
  const todayRange = getDayRange();

  const [weeklyRevenue, weeklyOrderCount, todayBookingsCount, weeklyShifts] =
    await Promise.all([
      prisma.order.aggregate({
        _sum: {
          totalAmountCents: true,
        },
        where: {
          createdAt: {
            gte: weekRange.start,
            lt: weekRange.end,
          },
          status: "COMPLETED",
        },
      }),
      prisma.order.count({
        where: {
          createdAt: {
            gte: weekRange.start,
            lt: weekRange.end,
          },
        },
      }),
      prisma.booking.count({
        where: {
          bookingTime: {
            gte: todayRange.start,
            lt: todayRange.end,
          },
        },
      }),
      prisma.shift.findMany({
        where: {
          date: {
            gte: weekRange.start,
            lt: weekRange.end,
          },
        },
        include: {
          staff: {
            select: {
              perHourRate: true,
            },
          },
        },
      }),
    ]);

  const revenueCents = weeklyRevenue._sum.totalAmountCents ?? 0;

  const weeklyShiftCostCents = weeklyShifts.reduce((total, shift) => {
    const startMinutes = shift_hours_to_minutes(shift.startTime);
    const endMinutes = shift_hours_to_minutes(shift.endTime);
    const durationMinutes =
      endMinutes >= startMinutes
        ? endMinutes - startMinutes
        : endMinutes + 24 * 60 - startMinutes; //handles the overnight shift

    const hourlyRateCents = Math.round(Number(shift.staff.perHourRate) * 100);
    const shiftCostCents = Math.round((durationMinutes / 60) * hourlyRateCents);

    return total + shiftCostCents;
  }, 0);

  return {
    revenueCents,
    weeklyOrderCount,
    todayBookingsCount,
    weeklyShiftCostCents,

    startofWeek: weekRange.start,
    endOfWeek: weekRange.end,
  };
});
