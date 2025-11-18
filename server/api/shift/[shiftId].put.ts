import { ShiftUpdateWithoutStaffInput } from "~/generated/prisma/models";

export default defineEventHandler(async (event) => {
  const prisma = usePrisma();
  const body = await readBody(event);
  const shifId = getRouterParam(event, "shiftId");

  const updateShift = await prisma.shift.update({
    where: {
      id: shifId,
    },
    data: body,
  });

  return updateShift;
});
