export default defineEventHandler(async (event) => {
  const prisma = usePrisma();
  const body = await readBody(event);

  const data = body.message;

  if (!data) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request, No Body provided",
    });
  }

  const tool_callId = data.toolCallList[0].id;
  const args = data.toolCallList[0].function.arguments;
  const {
    guestCount,
    bookingTime,
    customerName,
    customerPhone,
    specialRequest,
  } = args;

  try {
    await prisma.booking.create({
      data: {
        customerName: customerName,
        customerPhone: customerPhone,
        specialRequest: specialRequest,
        guestCount: guestCount,
        bookingTime: new Date(bookingTime),
      },
    });

    return {
      results: [
        {
          toolCallId: tool_callId,
          result: `Booking has been created successfully`,
        },
      ],
    };
  } catch (error) {
    return error;
  }
});
