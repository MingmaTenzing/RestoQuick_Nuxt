export default defineEventHandler(async (event) => {


  const prisma = usePrisma();

  const all_bookings = await prisma.booking.findMany({
    include: {
      table: true,
    },
  });
  return all_bookings;
});