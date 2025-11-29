export default defineEventHandler(async (event) => {
  // need to find ways to integrate vapi custom tools calling
  const prisma = usePrisma();
  const body = await readBody(event);

  const booking_details = await prisma.booking.create({
    data: body.booking,
  });

  return booking_details;
});
