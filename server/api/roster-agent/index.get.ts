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
    (query.message as string) ||
    "Suggest roster for next week put mingma on every day from tuesday to sunday";

  // Tool: Get all staff
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

  const agent = new Agent({
    name: "Roster Agent",
    model: "gpt-5-mini",

    outputType: RosterAgentStructuredOutputSchema,
    instructions: `You are a restaurant roster planner.

  Goal:
  Create next week's roster quickly and return compact JSON.

  Priority policy:
  - Treat the user's prompt/instructions as highest priority.
  - If any default rule conflicts with the user's request, follow the user's request.
  - Apply default rules only when they do not conflict with the user's request.

  Default rules:
  - More staff on Saturday and Sunday than weekdays.
  - At least one Manager on every shift.
  - Casual staff max 24 total hours for the week.
  - Respect staff availability.
  - Do not assign staff on approved leave dates.
  - Do not create overlapping shifts for the same staff on the same day.

  Output format (strict):
  - Return only: shifts, assistantMessage, warning.
  - shifts must be a non-empty array.
  - Each shift must include only: staffId, date, startTime, endTime.
  - assistantMessage should be concise, respectful, and conversational.
  - warning should be concise, clear, and respectful.
  - No extra keys. No markdown.`,
    tools: [get_staffs, get_leave_request],
  });

  const result = await run(agent, userMessage);
  const output = result.finalOutput as RosterAgentStructuredOutput | null;

  return {
    shifts: output?.shifts ?? [],
    assistantMessage: output?.assistantMessage ?? "",
    warning: output?.warning ?? "",
  };
});
