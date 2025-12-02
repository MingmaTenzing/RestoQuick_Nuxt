import { Vapi } from "@vapi-ai/server-sdk";
import { Prisma } from "~/generated/prisma/client";

export default defineEventHandler(async (event) => {
  const prisma = usePrisma();
  const body = await readBody(event);

  const data = body.message;
  console.log;
  const tool_callId = data.toolCallList[0].id;
  console.log(typeof data.toolCallList[0].function.arguments);
  const args = data.toolCallList[0].function.arguments;
  const {
    guestCount,
    bookingTime,
    customerName,
    customerPhone,
    specialRequest,
  } = args;

  console.log(guestCount, bookingTime, customerName);

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
