import { Vapi } from "@vapi-ai/server-sdk";
import { create } from "node:domain";

export default defineEventHandler(async (event) => {
  let args;

  const prisma = usePrisma();
  const body = await readBody(event);
  const toolCall = body.toolCalls?.[0];

  if (!toolCall) {
    throw createError({
      status: 400,
      statusMessage: "bad request no too call provided",
    });
  }

  const rawArgs = toolCall.function?.arguments;
  try {
    args = JSON.parse(rawArgs);
  } catch (error) {
    throw createError({
      status: 500,
      statusMessage: "cannot parse the arguments",
    });
  }

  console.log(args);

  const create_booking = await prisma.booking.create({
    data: {
      bookingTime: args.bookingTime,
      guestCount: args.guestCount,
      customerName: args.customerName,
      customerPhone: args.customerPhone,
      specialRequest: args.specialRequest,
    },
  });

  if (create_booking) {
    return {
      results: [
        {
          toolCallId: toolCall.toolCallList[0].id,
          result: `Booking has been made successfully `,
        },
      ],
    };
  } else {
    throw createError({
      status: 500,
      statusMessage: "Internal error creating booking",
    });
  }
});
