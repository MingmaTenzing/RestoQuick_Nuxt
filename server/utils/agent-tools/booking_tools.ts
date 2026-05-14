import { tool } from "@openai/agents";
import z from "zod";

const bookingStatusSchema = z.enum([
  "PENDING",
  "CONFIRMED",
  "SEATED",
  "COMPLETED",
  "CANCELLED",
  "NO_SHOW",
]);

export const booking_tools = () => {
  const prisma = usePrisma();

  const get_bookings = tool({
    name: "get_all_bookings",
    description:
      "Get all bookings with their assigned table details when available.",
    parameters: z.object({}),
    execute: async () => {
      const bookings = await prisma.booking.findMany({
        include: {
          table: true,
        },
        orderBy: {
          bookingTime: "asc",
        },
      });

      return bookings;
    },
  });

  const add_booking = tool({
    name: "add_booking",
    description:
      "Create a new booking with customer details, booking time, guest count, and optional table assignment. the booking time should be automatically converted to ISO format in the backend.",
    parameters: z.object({
      customerName: z.string().min(1),
      customerPhone: z.string().min(1),
      bookingTime: z.string(),
      guestCount: z.number().int().positive(),
      specialRequest: z.string().nullable(),
      status: bookingStatusSchema.default("PENDING"),
      tableId: z.string().min(1).nullable(),
    }),
    execute: async ({
      customerName,
      customerPhone,
      bookingTime,
      guestCount,
      specialRequest,
      status,
      tableId,
    }) => {
      const booking = await prisma.booking.create({
        data: {
          customerName,
          customerPhone,
          bookingTime: new Date(bookingTime),
          guestCount,
          ...(specialRequest ? { specialRequest } : {}),
          ...(status ? { status } : {}),
          ...(tableId ? { tableId } : {}),
        },
        include: {
          table: true,
        },
      });

      return booking;
    },
  });

  const delete_booking = tool({
    name: "delete_booking",
    description:
      "Delete all bookings that match an exact customer phone number.",
    parameters: z.object({
      customerPhone: z.string().min(1),
    }),
    execute: async ({ customerPhone }) => {
      const bookings = await prisma.booking.findMany({
        where: {
          customerPhone,
        },
        include: {
          table: true,
        },
      });

      const deletedBookings = await prisma.booking.deleteMany({
        where: {
          customerPhone,
        },
      });

      return {
        customerPhone,
        deletedCount: deletedBookings.count,
        deletedBookings: bookings,
      };
    },
  });

  return [get_bookings, add_booking, delete_booking];
};
