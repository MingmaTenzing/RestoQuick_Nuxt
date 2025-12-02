import { Vapi } from "@vapi-ai/server-sdk";

export default defineEventHandler(async (event) => {
  // const VAPI_TOOL_CALL: Vapi.ServerMessageToolCalls = await readBody(event);
  // console.log(VAPI_TOOL_CALL);

  let parsedArgs = null;
  const prisma = usePrisma();
  const body = await readBody(event);

  const VAPI_TOOL_REQUEST: Vapi.ServerMessageToolCalls = body.message;

  if (VAPI_TOOL_REQUEST) {
    parsedArgs = JSON.parse(
      VAPI_TOOL_REQUEST.toolCallList[0].function.arguments
    );
  } else {
    throw createError({
      statusCode: 400,
      statusMessage: "No body provided from VAPI",
    });
  }

  const create_booking = await prisma.booking.create({
    data: {
      bookingTime: parsedArgs.bookingTime,
      guestCount: parsedArgs.guestCount,
      customerName: parsedArgs.customerName,
      customerPhone: parsedArgs.customerPhone,
      specialRequest: parsedArgs.specialRequest,
    },
  });

  if (create_booking) {
    return {
      results: [
        {
          toolCallId: VAPI_TOOL_REQUEST.toolCallList[0].id,
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
