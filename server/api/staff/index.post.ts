import { Role } from "~/generated/prisma/enums";

export default defineEventHandler(async (event) => {
  const prisma = usePrisma();
  const addData = await prisma.staff.createMany({
    data: [
      {
        firstname: "John",
        lastName: "Smith",
        role: "Manager", // Role enum
        email: "john.smith@restaurant.com",
        phone: "0401000001",
      },
      {
        firstname: "Emily",
        lastName: "Brown",
        role: "Chef",
        email: "emily.brown@restaurant.com",
        phone: "0401000002",
        availability: ["WED", "THU", "FRI", "SAT"],
      },
      {
        firstname: "Liam",
        lastName: "Wilson",
        role: "Waiter",
        email: "liam.wilson@restaurant.com",
        phone: "0401000003",
        availability: ["FRI", "SAT", "SUN"],
      },
      {
        firstname: "Sophia",
        lastName: "Taylor",
        role: "Bartender",
        email: "sophia.taylor@restaurant.com",
        phone: "0401000004",
        availability: ["MON", "TUE", "WED"],
      },
      {
        firstname: "Noah",
        lastName: "Martin",
        role: "Cook",
        email: "noah.martin@restaurant.com",
        phone: "0401000005",
        availability: ["THU", "FRI", "SAT", "SUN"],
      },
      {
        firstname: "Olivia",
        lastName: "Anderson",
        role: "Kitchen_Hand",
        email: "olivia.anderson@restaurant.com",
        phone: "0401000006",
        availability: ["MON", "THU", "FRI"],
      },
    ],
  });

  return addData;
});
