import { Role } from "~/generated/prisma/enums";

export default defineEventHandler(async (event) => {
  const data = [
    {
      firstname: "John",
      lastName: "Doe",
      role: Role.Manager,
      email: "john.doe@restaurant.com",
      phone: "0400000001",
      availability: ["mon", "tue", "wed", "thu", "fri"],
    },
    {
      firstname: "Sarah",
      lastName: "Smith",
      role: Role.Chef,
      email: "sarah.smith@restaurant.com",
      phone: "0400000002",
      availability: ["tue", "wed", "thu", "fri", "sat"],
    },
    {
      firstname: "Mike",
      lastName: "Brown",
      role: Role.Cook,
      email: "mike.brown@restaurant.com",
      phone: "0400000003",
      availability: ["mon", "wed", "fri", "sat", "sun"],
    },
    {
      firstname: "Emily",
      lastName: "Johnson",
      role: Role.Waiter,
      email: "emily.johnson@restaurant.com",
      phone: "0400000004",
      availability: ["thu", "fri", "sat", "sun"],
    },
    {
      firstname: "Alex",
      lastName: "Lee",
      role: Role.Kitchen_Hand,
      email: "alex.lee@restaurant.com",
      phone: "0400000005",
      availability: ["mon", "tue", "wed", "thu", "fri"],
    },
  ];
  const prisma = usePrisma();
  const add_data = await prisma.staff.createMany({
    data: data,
  });

  return add_data;
});
