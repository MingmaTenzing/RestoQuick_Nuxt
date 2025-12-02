import { Vapi } from "@vapi-ai/server-sdk";
import { read } from "fs";

export default defineEventHandler(async (event) => {
  // const VAPI_TOOL_CALL: Vapi.ServerMessageToolCalls = await readBody(event);
  // console.log(VAPI_TOOL_CALL);

  const body = await readBody(event);
  console.log(body);
  return body;
  // const response: Vapi.ServerMessageResponseToolCalls = {
  //   results: [
  //     {
  //       name: VAPI_TOOL_CALL.toolCallList[0].function.name,
  //       toolCallId: VAPI_TOOL_CALL.call!.id,
  //       result: "Booking is confirmed",
  //     },
  //   ],
  // };
});
