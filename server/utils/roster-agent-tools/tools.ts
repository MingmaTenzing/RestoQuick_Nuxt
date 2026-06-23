import { tool } from "@openai/agents";
import { useDateRange } from "~~/server/utils/dateRange";
import z from "zod";

const createShiftSchema = z.object({
  staffId: z.string().min(1),
  date: z.string(),
  startTime: z.string().min(1),
  endTime: z.string().min(1),
  position: z.string().min(1).nullable(),
});

const toDateString = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const roster_agent_tools = () => {
  const prisma = usePrisma();
  const { getDayRange, getWeekRange, getNextWeekRange } = useDateRange();

  const get_roster_date_context = tool({
    name: "get_roster_date_context",
    description:
      "Get today's date and the exact Monday-to-Sunday date range for next week. Use this before planning any roster that mentions relative dates like next week, this week, tomorrow, or today.",
    parameters: z.object({}),
    execute: async () => {
      const today = getDayRange().start;
      const thisWeek = getWeekRange();
      const nextWeek = getNextWeekRange();

      return {
        currentDate: toDateString(today),
        currentDay: today.toLocaleDateString("en-US", { weekday: "long" }),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        thisWeek: {
          startDate: toDateString(thisWeek.start),
          endDate: toDateString(new Date(thisWeek.end.getTime() - 1)),
        },
        nextWeek: {
          startDate: toDateString(nextWeek.start),
          endDate: toDateString(new Date(nextWeek.end.getTime() - 1)),
        },
      };
    },
  });

  const get_roster_shifts = tool({
    name: "get_roster_shifts",
    description:
      "Get roster shifts with staff details for this week, next week, or a custom inclusive date range. Use this when the user asks to show, view, inspect, or summarize an existing roster.",
    parameters: z.object({
      range: z.enum(["this_week", "next_week", "custom"]),
      startDate: z.string().nullable(),
      endDate: z.string().nullable(),
    }),
    execute: async ({ range, startDate, endDate }) => {
      const resolvedRange = (() => {
        if (range === "this_week") {
          return getWeekRange();
        }

        if (range === "next_week") {
          return getNextWeekRange();
        }

        if (!startDate || !endDate) {
          throw new Error(
            "Custom roster range requires startDate and endDate.",
          );
        }

        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);

        const end = new Date(endDate);
        end.setHours(0, 0, 0, 0);
        end.setDate(end.getDate() + 1);

        return { start, end };
      })();

      const shifts = await prisma.shift.findMany({
        where: {
          date: {
            gte: resolvedRange.start,
            lt: resolvedRange.end,
          },
        },
        include: {
          staff: true,
        },
        orderBy: [{ date: "asc" }, { startTime: "asc" }],
      });

      return {
        range: {
          startDate: toDateString(resolvedRange.start),
          endDate: toDateString(new Date(resolvedRange.end.getTime() - 1)),
        },
        shifts: shifts.map((shift) => ({
          id: shift.id,
          date: toDateString(shift.date),
          startTime: shift.startTime,
          endTime: shift.endTime,
          position: shift.position,
          staff: {
            id: shift.staff.id,
            firstname: shift.staff.firstname,
            lastName: shift.staff.lastName,
            role: shift.staff.role,
            employmentType: shift.staff.employmentType,
          },
        })),
      };
    },
  });

  const get_staffs = tool({
    name: "get_all_staff_members",
    description:
      "Get all staff members with role, employment type, weekday availability, hourly rate, and profile details. Use this first to decide who can work each day and role.",
    parameters: z.object({}),
    execute: async () => {
      const staffList = await prisma.staff.findMany({
        orderBy: { firstname: "asc" },
      });

      return staffList.map((staff) => ({
        id: staff.id,
        firstname: staff.firstname,
        lastName: staff.lastName,
        role: staff.role,
        employmentType: staff.employmentType,
        perHourRate: Number(staff.perHourRate),
        availability: staff.availability,
      }));
    },
  });

  const get_leave_request = tool({
    name: "get_all_leave_requests",
    description:
      "Get all leave requests. Treat approved leave dates as unavailable and avoid assigning shifts for those staff on those dates.",
    parameters: z.object({}),
    execute: async () => {
      const leaveRequests = await prisma.leaveRequest.findMany({});

      return leaveRequests.map((leave) => ({
        id: leave.id,
        staffId: leave.staffId,
        startDate: leave.startDate.toISOString(),
        endDate: leave.endDate.toISOString(),
        reason: leave.reason,
        status: leave.status,
        submittedAt: leave.submittedAt.toISOString(),
      }));
    },
  });

  const create_many_shifts = tool({
    name: "create_many_shifts",
    description:
      "Create many shifts at once using a list of staff id, date, start time, end time, and position. Pass null for position to use Staff.",
    parameters: z.object({
      shifts: z.array(createShiftSchema).min(1),
    }),
    execute: async ({ shifts }) => {
      const response = await prisma.shift.createMany({
        data: shifts.map((shift) => ({
          staffId: shift.staffId,
          date: new Date(shift.date),
          startTime: shift.startTime,
          endTime: shift.endTime,
          position: shift.position ?? "Staff",
        })),
      });

      return response;
    },
  });

  return {
    get_roster_date_context,
    get_roster_shifts,
    get_staffs,
    get_leave_request,
    create_many_shifts,
  };
};
