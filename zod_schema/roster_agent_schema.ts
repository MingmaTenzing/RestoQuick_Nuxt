import { z } from "zod";

export const RosterRoleSchema = z.enum([
  "Chef",
  "Waiter",
  "Bartender",
  "Manager",
  "Cook",
  "Kitchen_Hand",
]);

export const RosterWeekDaySchema = z.enum([
  "MON",
  "TUE",
  "WED",
  "THU",
  "FRI",
  "SAT",
  "SUN",
]);

export const RosterEmploymentTypeSchema = z.enum([
  "PartTime",
  "FullTime",
  "Casual",
]);

export const RosterLeaveStatusSchema = z.enum([
  "pending",
  "approved",
  "rejected",
]);

export const RosterAgentLeaveRequestSchema = z.object({
  id: z.string(),
  staffId: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  reason: z.string(),
  status: RosterLeaveStatusSchema,
  submittedAt: z.string(),
});

// export const RosterAgentStaffSchema = z.object({
//   id: z.string(),
//   firstname: z.string(),
//   lastName: z.string(),
//   role: RosterRoleSchema,
//   email: z.string(),
//   phone: z.string(),
//   employmentType: RosterEmploymentTypeSchema,
//   perHourRate: z.number(),
//   availability: z.array(RosterWeekDaySchema),
//   joined_date: z.string(),
//   leaveRequests: z.array(RosterAgentLeaveRequestSchema).default([]),
//   profile_photo_url: z.string().optional().default(""),
// });

export const RosterAgentShiftSuggestionSchema = z.object({
  staffId: z.string(),
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
});

export const RosterAgentStructuredOutputSchema = z.object({
  shifts: z.array(RosterAgentShiftSuggestionSchema),
  assistantMessage: z.string().default(""),
  warning: z.string().default(""),
});

export type RosterAgentStructuredOutput = z.infer<
  typeof RosterAgentStructuredOutputSchema
>;
