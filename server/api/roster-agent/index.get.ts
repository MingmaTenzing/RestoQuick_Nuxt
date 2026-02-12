import { Agent, run, tool } from "@openai/agents";
import { z } from "zod";
import { usePrisma } from "~~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  const prisma = usePrisma();
  const query = getQuery(event);
  const userMessage =
    (query.message as string) ||
    "Suggest a roster for next week using available staff, shifts, and leave requests.";

  const SuggestedShift = z.object({
    date: z.string(),
    staffId: z.string(),
    staffName: z.string(),
    role: z.string(),
    startTime: z.string(),
    endTime: z.string(),
    position: z.string(),
    reason: z.string(),
  });

  const RosterSuggestion = z.object({
    weekStart: z.string(),
    weekEnd: z.string(),
    timezone: z.string(),
    assumptions: z.array(z.string()),
    coverageSummary: z.array(
      z.object({
        day: z.string(),
        notes: z.string(),
      }),
    ),
    suggestedShifts: z.array(SuggestedShift),
    warnings: z.array(z.string()),
  });

  const asIsoDate = (value: Date) => value.toISOString().slice(0, 10);
  const getNextWeekRange = () => {
    const now = new Date();
    const day = now.getDay();
    const daysUntilNextMonday = (8 - day) % 7 || 7;
    const start = new Date(now);
    start.setDate(now.getDate() + daysUntilNextMonday);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  };

  const { start: nextWeekStart, end: nextWeekEnd } = getNextWeekRange();
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

  const getStaffTool = tool({
    name: "get_staff",
    description:
      "Fetch all staff with role, employment type, availability, and hourly rate.",
    parameters: z.object({}),
    execute: async () => {
      const staffs = await prisma.staff.findMany({
        orderBy: { firstname: "asc" },
      });
      return staffs.map((staff) => ({
        id: staff.id,
        firstname: staff.firstname,
        lastName: staff.lastName,
        role: staff.role,
        employmentType: staff.employmentType,
        perHourRate: staff.perHourRate.toString(),
        availability: staff.availability,
      }));
    },
  });

  const getShiftsTool = tool({
    name: "get_shifts",
    description:
      "Fetch shifts between a date range. Dates are expected in ISO format.",
    parameters: z.object({
      startDate: z.string(),
      endDate: z.string(),
    }),
    execute: async ({ startDate, endDate }) => {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const shifts = await prisma.shift.findMany({
        where: {
          date: {
            gte: start,
            lte: end,
          },
        },
        orderBy: {
          date: "asc",
        },
      });
      return shifts.map((shift) => ({
        id: shift.id,
        staffId: shift.staffId,
        date: shift.date.toISOString(),
        startTime: shift.startTime,
        endTime: shift.endTime,
        position: shift.position,
      }));
    },
  });

  const getLeaveRequestsTool = tool({
    name: "get_leave_requests",
    description:
      "Fetch leave requests, optionally filtered by date range. Dates are ISO format.",
    parameters: z.object({
      startDate: z.string(),
      endDate: z.string(),
    }),
    execute: async ({ startDate, endDate }) => {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const leaveRequests = await prisma.leaveRequest.findMany({
        where: {
          startDate: {
            lte: end,
          },
          endDate: {
            gte: start,
          },
        },
        orderBy: {
          startDate: "asc",
        },
      });
      return leaveRequests.map((leave) => ({
        id: leave.id,
        staffId: leave.staffId,
        startDate: leave.startDate.toISOString(),
        endDate: leave.endDate.toISOString(),
        status: leave.status,
        reason: leave.reason,
      }));
    },
  });

  const agent = new Agent({
    name: "Roster Agent",
    model: "gpt-5-mini",
    outputType: RosterSuggestion,
    instructions:
      "You are a helpful assistant that suggests a roster for next week. Use tools to fetch staff, shifts, and leave requests. Always pass startDate and endDate when calling tools that require them. Respect staff availability and approved leave. Keep suggestions practical and avoid conflicts. Output must match the provided schema.",
    tools: [getStaffTool, getShiftsTool, getLeaveRequestsTool],
  });

  const result = await run(
    agent,
    [
      `Next week range: ${asIsoDate(nextWeekStart)} to ${asIsoDate(nextWeekEnd)} (${timezone}).`,
      "Provide a full suggested roster for that week.",
      userMessage,
    ].join("\n"),
  );

  return result.output ?? result;
});
