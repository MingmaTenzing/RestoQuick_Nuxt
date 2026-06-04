import { tool } from "@openai/agents";
import z from "zod";

export const shift_tools = () => {
  const prisma = usePrisma();

  const get_shifts = tool({
    name: "get_all_shifts",
    description: "Get all shifts with their staff details.",
    parameters: z.object({}),
    execute: async () => {
      const shifts = await prisma.shift.findMany({
        include: {
          staff: true,
        },
        orderBy: {
          date: "asc",
        },
      });

      return shifts;
    },
  });

  const get_shift = tool({
    name: "get_shift",
    description: "Get one shift using the exact shift id.",
    parameters: z.object({
      shiftId: z.string().min(1),
    }),
    execute: async ({ shiftId }) => {
      const shift = await prisma.shift.findUnique({
        where: {
          id: shiftId,
        },
        include: {
          staff: true,
        },
      });

      if (!shift) {
        throw new Error("Shift not found for this shift id.");
      }

      return shift;
    },
  });

  const get_staff_shifts = tool({
    name: "get_staff_shifts",
    description:
      "Get all shifts for a staff member using the exact staff email.",
    parameters: z.object({
      email: z.string(),
    }),
    execute: async ({ email }) => {
      const staff = await prisma.staff.findUnique({
        where: {
          email,
        },
      });

      if (!staff) {
        throw new Error("Staff not found for this email.");
      }

      const shifts = await prisma.shift.findMany({
        where: {
          staffId: staff.id,
        },
        include: {
          staff: true,
        },
        orderBy: {
          date: "asc",
        },
      });

      return shifts;
    },
  });

  const add_shift = tool({
    name: "add_shift",
    description:
      "Create a shift with staff id, shift date, start time, end time, and position.",
    parameters: z.object({
      staffId: z.string().min(1),
      date: z.string(),
      startTime: z.string().min(1),
      endTime: z.string().min(1),
      position: z.string().min(1),
    }),
    execute: async ({ staffId, date, startTime, endTime, position }) => {
      const shift = await prisma.shift.create({
        data: {
          staffId,
          date: new Date(date),
          startTime,
          endTime,
          position,
        },
        include: {
          staff: true,
        },
      });

      return shift;
    },
  });

  const update_shift = tool({
    name: "update_shift",
    description:
      "Update a shift using the exact shift id. Pass null for any field you do not want to change.",
    parameters: z
      .object({
        shiftId: z.string().min(1),
        staffId: z.string().nullable(),
        date: z.string().nullable(),
        startTime: z.string().nullable(),
        endTime: z.string().nullable(),
        position: z.string().nullable(),
      })
      .strict(),
    execute: async ({
      shiftId,
      staffId,
      date,
      startTime,
      endTime,
      position,
    }) => {
      const shift = await prisma.shift.update({
        where: {
          id: shiftId,
        },
        data: {
          ...(staffId !== null ? { staffId } : {}),
          ...(date !== null ? { date: new Date(date) } : {}),
          ...(startTime !== null ? { startTime } : {}),
          ...(endTime !== null ? { endTime } : {}),
          ...(position !== null ? { position } : {}),
        },
        include: {
          staff: true,
        },
      });

      return shift;
    },
  });

  const delete_shift = tool({
    name: "delete_shift",
    description: "Delete a shift using the exact shift id.",
    parameters: z.object({
      shiftId: z.string().min(1),
    }),
    execute: async ({ shiftId }) => {
      const shift = await prisma.shift.delete({
        where: {
          id: shiftId,
        },
        include: {
          staff: true,
        },
      });

      return shift;
    },
  });

  return [
    get_shifts,
    get_shift,
    get_staff_shifts,
    add_shift,
    update_shift,
    delete_shift,
  ];
};
