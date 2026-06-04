//this endpoint finds the staff by id and returns the staff with week-filtered shifts;
export default defineEventHandler((event) => {
  const prisma = usePrisma();
  const staffId = getRouterParam(event, "staffId");
  const query = getQuery(event);

  const requestedStart = query.startDate
    ? new Date(String(query.startDate))
    : null;
  const requestedEnd = query.endDate ? new Date(String(query.endDate)) : null;

  const startDate =
    requestedStart && !Number.isNaN(requestedStart.getTime())
      ? requestedStart
      : null;
  const endDate =
    requestedEnd && !Number.isNaN(requestedEnd.getTime()) ? requestedEnd : null;

  const findStaff = prisma.staff.findUnique({
    where: {
      id: staffId,
    },
    include: {
      shifts: {
        orderBy: {
          date: "asc",
        },
        where:
          startDate && endDate
            ? {
                date: {
                  gte: startDate,
                  lte: endDate,
                },
              }
            : undefined,
      },
      leaveRequests: {
        orderBy: {
          submittedAt: "desc",
        },
        where: {
          status: "pending",
        },
      },
    },
  });

  return findStaff;
});
