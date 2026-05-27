import { tool } from "@openai/agents";
import z from "zod";

const createShiftSchema = z.object({
  staffId: z.string().min(1),
  date: z.string(),
  startTime: z.string().min(1),
  endTime: z.string().min(1),
  position: z.string().min(1).nullable(),
});

export const roster_agent_tools = () => {
  const prisma = usePrisma();

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
    get_staffs,
    get_leave_request,
    create_many_shifts,
  };
};
