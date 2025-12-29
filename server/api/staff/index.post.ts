import { Role } from "~/generated/prisma/enums";

export default defineEventHandler(async (event) => {
  const prisma = usePrisma();
  const add_data = await prisma.staff.create({
    data: {
      firstname: "Ming",
      lastName: "Sherpa",
      phone: "023444222",
      availability: ["mon", "tue"],
      email: "mingma@gamil.com",
      role: Role.Cook,
    },
  });

  return add_data;
});
