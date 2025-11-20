export default defineEventHandler(async (event) => {
  const prisma = usePrisma();
  const body = await readBody(event);

  const booking_details = await prisma.booking.create({
    data: body.booking,
  });

  return booking_details;
});
