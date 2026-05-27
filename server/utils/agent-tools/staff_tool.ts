import { tool } from "@openai/agents";
import z from "zod";

const staffRoleSchema = z.enum([
  "Chef",
  "Waiter",
  "Bartender",
  "Manager",
  "Cook",
  "Kitchen_Hand",
]);

const employmentTypeSchema = z.enum(["PartTime", "FullTime", "Casual"]);

const weekDaySchema = z.enum(["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]);

export const staff_tool = () => {
  const prisma = usePrisma();

  const get_staffs = tool({
    name: "get_all_staffs",
    description: "Get all staff members.",
    parameters: z.object({}),
    execute: async () => {
      const staffs = await prisma.staff.findMany({
        orderBy: {
          firstname: "asc",
        },
      });

      return staffs;
    },
  });

  const add_staff = tool({
    name: "add_staff",
    description:
      "Create a staff member with name, role, email, phone, employment type, hourly rate, and availability.",
    parameters: z.object({
      firstname: z.string().min(1),
      lastName: z.string().min(1),
      role: staffRoleSchema,
      email: z.string(),
      phone: z.string().min(1),
      employmentType: employmentTypeSchema,
      perHourRate: z.number().nonnegative(),
      availability: z.array(weekDaySchema),
      profile_photo_url: z.string().nullable(),
    }),
    execute: async ({
      firstname,
      lastName,
      role,
      email,
      phone,
      employmentType,
      perHourRate,
      availability,
      profile_photo_url,
    }) => {
      const staff = await prisma.staff.create({
        data: {
          firstname,
          lastName,
          role,
          email,
          phone,
          employmentType,
          perHourRate,
          availability,
          ...(profile_photo_url ? { profile_photo_url } : {}),
        },
      });

      return staff;
    },
  });

  const update_staff = tool({
    name: "update_staff",
    description:
      "Update a staff member using the exact email. Pass null for any field you do not want to change.",
    parameters: z
      .object({
        email: z.string(),
        firstname: z.string().nullable(),
        lastName: z.string().nullable(),
        role: staffRoleSchema.nullable(),
        phone: z.string().nullable(),
        employmentType: employmentTypeSchema.nullable(),
        perHourRate: z.number().nonnegative().nullable(),
        availability: z.array(weekDaySchema).nullable(),
        profile_photo_url: z.string().nullable(),
      })
      .strict(),
    execute: async ({
      email,
      firstname,
      lastName,
      role,
      phone,
      employmentType,
      perHourRate,
      availability,
      profile_photo_url,
    }) => {
      const existingStaff = await prisma.staff.findUnique({
        where: {
          email,
        },
      });

      if (!existingStaff) {
        throw new Error("Staff not found for this email.");
      }

      const staff = await prisma.staff.update({
        where: {
          id: existingStaff.id,
        },
        data: {
          ...(firstname !== null ? { firstname } : {}),
          ...(lastName !== null ? { lastName } : {}),
          ...(role !== null ? { role } : {}),
          ...(phone !== null ? { phone } : {}),
          ...(employmentType !== null ? { employmentType } : {}),
          ...(perHourRate !== null ? { perHourRate } : {}),
          ...(availability !== null ? { availability } : {}),
          ...(profile_photo_url !== null ? { profile_photo_url } : {}),
        },
      });

      return staff;
    },
  });

  const delete_staff = tool({
    name: "delete_staff",
    description: "Delete a staff member using the exact email.",
    parameters: z.object({
      email: z.string(),
    }),
    execute: async ({ email }) => {
      const staff = await prisma.staff.delete({
        where: {
          email,
        },
      });

      return staff;
    },
  });

  return [get_staffs, add_staff, update_staff, delete_staff];
};
