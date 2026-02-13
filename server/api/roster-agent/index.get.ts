import { Agent, run, tool } from "@openai/agents";
import { z } from "zod";
import { usePrisma } from "~~/server/utils/prisma";
import {
  RosterAgentStructuredOutputSchema,
  type RosterAgentStructuredOutput,
} from "../../../zod_schema/roster_agent_schema";

export default defineEventHandler(async (event) => {
  const prisma = usePrisma();
  const query = getQuery(event);
  const userMessage =
    (query.message as string) || "Suggest roster for next week";

  // Tool: Get all staff
  const get_staffs = tool({
    name: "get_all_staff_members",
    description:
      "Get all staff members with role, employment type, weekday availability, hourly rate, and profile details. Use this first to decide who can work each day and role.",
    parameters: z.object({}),
    strict: true,
    execute: async () => {
      const staffList = await prisma.staff.findMany({
        orderBy: { firstname: "asc" },
      });

      return staffList.map((staff) => ({
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
        leaveRequests: [],
        profile_photo_url: staff.profile_photo_url || "",
      }));
    },
  });

  const get_leave_request = tool({
    name: "get_all_leave_requests",
    description:
      "Get all leave requests. Treat approved leave dates as unavailable and avoid assigning shifts for those staff on those dates.",
    parameters: z.object({}),
    strict: true,
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

  const get_existing_shifts = tool({
    name: "get_existing_shifts",
    description:
      "Get existing shifts so you avoid duplicate or overlapping assignments when suggesting next-week roster.",
    parameters: z.object({}),
    strict: true,
    execute: async () => {
      const shifts = await prisma.shift.findMany({
        include: { staff: true },
      });

      return shifts.map((shift) => ({
        id: shift.id,
        staffId: shift.staffId,
        date: shift.date.toISOString(),
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
          leaveRequests: [],
          profile_photo_url: shift.staff.profile_photo_url || "",
        },
      }));
    },
  });

  const agent = new Agent({
    name: "Roster Agent",
    model: "gpt-5-mini",

    outputType: RosterAgentStructuredOutputSchema,
    instructions: `You are an expert roster planner for a restaurant.

    Goal:
    Create an on-point weekly roster for next week.

    Use tools in this order:
    1) get_all_staff_members
    2) get_all_leave_requests
    3) get_existing_shifts

    Hard rules:
    - Weekend (Saturday and Sunday) is busy: schedule more staff than weekdays.
    - A Manager must be present on every shift.
    - Weekdays are less busy: keep staffing lean but operationally safe.
    - Casual staff can work a maximum of 24 total hours for the week.
    - Respect each staff member's availability.
    - Do not schedule staff on approved leave dates.
    - Avoid overlapping shifts for the same staff member on the same day.

    Planning guidance:
    - Cover core service roles each day (kitchen + floor).
    - Prioritize FullTime and PartTime for baseline coverage.
    - Use Casual as flex support, especially to strengthen weekend coverage, while respecting the 24-hour cap.
    - Balance shifts fairly when possible.

    Output requirements:
    - Return an object with key "shifts" containing the suggested shifts.
    - shifts must be a non-empty array.
    - Every shift must include a non-empty staffId and full staff details.
    - Include full staff details in each suggested shift.
    - Also include these chat fields for natural conversation in a modal:
      1) assistantMessage: a concise natural-language summary of the plan.
      2) whyThisRoster: bullet-style reasons for key staffing decisions.
      3) staffingRisks: potential risks/gaps to watch.
      4) followUpQuestions: smart clarifying questions to ask the manager.
      5) nextActions: practical next steps manager can take now.`,
    tools: [get_staffs, get_leave_request, get_existing_shifts],
  });

  const result = await run(agent, userMessage);
  const output = result.finalOutput as RosterAgentStructuredOutput | null;

  return {
    shifts: output?.shifts ?? [],
    assistantMessage: output?.assistantMessage ?? "",
    whyThisRoster: output?.whyThisRoster ?? [],
    staffingRisks: output?.staffingRisks ?? [],
    followUpQuestions: output?.followUpQuestions ?? [],
    nextActions: output?.nextActions ?? [],
  };
});
