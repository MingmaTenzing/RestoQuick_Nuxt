import { Agent, run, tool } from "@openai/agents";
import { z } from "zod";
import { usePrisma } from "~~/server/utils/prisma";
import { Shift_with_Staff_Schema_Simple } from "../../../zod_schema/database_schema";

export default defineEventHandler(async (event) => {
  const prisma = usePrisma();
  const query = getQuery(event);
  const userMessage =
    (query.message as string) ||
    "Suggest a roster for next week using available staff, shifts, and leave requests.";

  // Helper to compute next week's date range
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

  const asIsoDate = (value: Date) => value.toISOString().split("T")[0];
  const { start: nextWeekStart, end: nextWeekEnd } = getNextWeekRange();

  // Tool: Get all staff
  const getStaffTool = tool({
    name: "get_all_staff",
    description:
      "Fetch all staff with their roles, availability, and hourly rates.",
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
        email: staff.email,
        phone: staff.phone,
        employmentType: staff.employmentType,
        perHourRate: Number(staff.perHourRate),
        availability: staff.availability,
        joined_date: staff.joined_date.toISOString(),
        shifts: [],
        leaveRequests: [],
        profile_photo_url: staff.profile_photo_url,
      }));
    },
  });

  // Tool: Get approved leave requests for next week
  const getLeaveRequestsTool = tool({
    name: "get_approved_leaves",
    description:
      "Fetch approved leave requests for next week. Returns staff IDs who are on leave.",
    parameters: z.object({}),
    execute: async () => {
      const leaves = await prisma.leaveRequest.findMany({
        where: {
          status: "approved",
          startDate: { lte: nextWeekEnd },
          endDate: { gte: nextWeekStart },
        },
      });
      return leaves.map((leave) => ({
        staffId: leave.staffId,
        startDate: asIsoDate(leave.startDate),
        endDate: asIsoDate(leave.endDate),
        reason: leave.reason,
      }));
    },
  });

  // Tool: Get existing shifts for next week
  const getExistingShiftsTool = tool({
    name: "get_existing_shifts",
    description: "Fetch existing shifts already scheduled for next week.",
    parameters: z.object({}),
    execute: async () => {
      const shifts = await prisma.shift.findMany({
        where: {
          date: { gte: nextWeekStart, lte: nextWeekEnd },
        },
        include: { staff: true },
      });
      return shifts.map((shift) => ({
        id: shift.id,
        staffId: shift.staffId,
        date: shift.date.toISOString().split("T")[0],
        startTime: shift.startTime,
        endTime: shift.endTime,
        position: shift.position,
        staff: {
          id: shift.staff.id,
          firstname: shift.staff.firstname,
          lastName: shift.staff.lastName,
          role: shift.staff.role,
          email: shift.staff.email,
          phone: shift.staff.phone,
          employmentType: shift.staff.employmentType,
          perHourRate: Number(shift.staff.perHourRate),
          availability: shift.staff.availability,
          joined_date: shift.staff.joined_date.toISOString(),
          shifts: [],
          leaveRequests: [],
          profile_photo_url: shift.staff.profile_photo_url,
        },
      }));
    },
  });

  const RosterSuggestionOutput = z.object({
    suggestedShifts: z.array(Shift_with_Staff_Schema_Simple),
  });

  const agent = new Agent({
    name: "Roster Agent",
    model: "gpt-5-mini",
    outputType: Shift_with_Staff_Schema_Simple,
    instructions: `You are a helpful roster assistant. Your job is to suggest shifts for next week (${asIsoDate(nextWeekStart)} to ${asIsoDate(nextWeekEnd)}).
    
Steps:
1. Use get_all_staff to fetch all available staff
2. Use get_approved_leaves to identify who is on leave
3. Use get_existing_shifts to see what's already scheduled
4. Suggest new shifts to fill gaps, respecting:
   - Staff availability (weekday preferences)
   - Approved leave dates
   - Avoiding schedule conflicts
   - Mix of roles (Chef, Waiter, Bartender, etc.)

Output the suggested shifts as an array matching the schema. Each shift must include full staff details.`,
    tools: [getStaffTool, getLeaveRequestsTool, getExistingShiftsTool],
  });

  const result = await run(agent, userMessage);

  return result;
});
