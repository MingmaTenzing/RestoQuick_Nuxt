export default defineEventHandler(async (event) => {
  const prisma = usePrisma();

  const body = await readBody(event);
  const new_staff_details = body.staff;
  const addData = await prisma.staff.create({
    data: new_staff_details,
  });

  return addData;
});
