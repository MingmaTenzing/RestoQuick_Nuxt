import { PrismaClient, Role } from "~/generated/prisma/client";
import { usePrisma } from "~~/server/utils/prisma";

const staffData = [
  {
    firstname: "Liam",
    lastName: "Nguyen",
    role: Role.Chef,
    email: "liam.nguyen@example.com",
    phone: "0412 345 678",
    availability: ["Monday", "Tuesday", "Friday"],
  },
  {
    firstname: "Ava",
    lastName: "Smith",
    role: Role.Waiter,
    email: "ava.smith@example.com",
    phone: "0423 567 890",
    availability: ["Wednesday", "Thursday", "Saturday"],
  },
  {
    firstname: "Noah",
    lastName: "Patel",
    role: Role.Manager,
    email: "noah.patel@example.com",
    phone: "0434 678 901",
    availability: ["Friday", "Saturday", "Sunday"],
  },
  {
    firstname: "Sophia",
    lastName: "Chen",
    role: Role.Manager,
    email: "sophia.chen@example.com",
    phone: "0456 789 012",
    availability: ["Monday", "Tuesday", "Wednesday", "Thursday"],
  },
  {
    firstname: "Ethan",
    lastName: "Williams",
    role: Role.Cook,
    email: "ethan.williams@example.com",
    phone: "0467 890 123",
    availability: ["Tuesday", "Thursday", "Sunday"],
  },
  {
    firstname: "Olivia",
    lastName: "Brown",
    role: Role.Kitchen_Hand,
    email: "olivia.brown@example.com",
    phone: "0478 901 234",
    availability: ["Monday", "Wednesday", "Friday", "Saturday"],
  },
];

export default defineEventHandler(async () => {
  const prisma = usePrisma();
  const addDstaff = await prisma.staff.createMany({
    data: staffData,
  });
  console.log(addDstaff);
});
