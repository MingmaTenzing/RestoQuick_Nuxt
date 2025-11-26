export default defineEventHandler(async (event) => {
  const prisma = usePrisma();
  const booking_id = getRouterParam(event, "booking-id");
  const body = await readBody(event);

  const update_booking_status = await prisma.booking.update({
    where: {
      id: booking_id,
    },
    data: {
      status: body.status,
    },
  });

  return update_booking_status;
});
