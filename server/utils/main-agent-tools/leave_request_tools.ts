import { tool } from "@openai/agents";
import z from "zod";

const leaveRequestStatusSchema = z.enum(["pending", "approved", "rejected"]);

export const leave_request_tools = () => {
  const prisma = usePrisma();

  const get_leave_request = tool({
    name: "get_all_leave_requests",
    description:
      "Get all leave requests. Treat approved leave dates as unavailable and avoid assigning shifts for those staff on those dates.",
    parameters: z.object({}),
    execute: async () => {
      const leaveRequests = await prisma.leaveRequest.findMany({
        orderBy: {
          submittedAt: "desc",
        },
      });

      return leaveRequests;
    },
  });

  const add_leave_request = tool({
    name: "add_leave_request",
    description:
      "Create a new leave request for a staff member with date range, reason, and optional status.",
    parameters: z.object({
      staffId: z.string().min(1),
      startDate: z.string(),
      endDate: z.string(),
      reason: z.string(),
      status: leaveRequestStatusSchema.default("pending"),
    }),
    execute: async ({ staffId, startDate, endDate, reason, status }) => {
      const added_leaveRequest = await prisma.leaveRequest.create({
        data: {
          staffId,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          reason,
          ...(status ? { status } : {}),
        },
      });

      return added_leaveRequest;
    },
  });

  const update_leave_request = tool({
    name: "update_leave_request",
    description:
      "Update an existing leave request status using the leave request id.",
    parameters: z.object({
      requestId: z.string().min(1),
      status: leaveRequestStatusSchema,
    }),
    execute: async ({ requestId, status }) => {
      const updated_leaveRequest = await prisma.leaveRequest.update({
        where: {
          id: requestId,
        },
        data: {
          status,
        },
      });

      return updated_leaveRequest;
    },
  });

  const delete_leave_request = tool({
    name: "delete_leave_request",
    description: "Delete a leave request using its id.",
    parameters: z.object({
      requestId: z.string().min(1),
    }),
    execute: async ({ requestId }) => {
      const deleted_leaveRequest = await prisma.leaveRequest.delete({
        where: {
          id: requestId,
        },
      });

      return deleted_leaveRequest;
    },
  });

  return [
    get_leave_request,
    add_leave_request,
    update_leave_request,
    delete_leave_request,
  ];
};
