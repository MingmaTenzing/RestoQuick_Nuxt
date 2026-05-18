import { Agent, run } from "@openai/agents";
import { booking_tools } from "~~/server/utils/agent-tools/booking_tools";
import { leave_request_tools } from "~~/server/utils/agent-tools/leave_request_tools";

import { restoquickAgentInstructions } from "~~/server/utils/restoquick-agent-instructions";
export default defineEventHandler(async (event) => {
  const agent = new Agent({
    name: "RestoQuick Assistant",
    model: "gpt-5-mini-2025-08-07",
    instructions: restoquickAgentInstructions,
    tools: [...leave_request_tools(), ...booking_tools()],
  });

  const result = await run(
    agent,
    "update the booking for 0456231641 change the guest count to 6, name to elon altman and booking time to 6pm",
  );

  return result.finalOutput;
});
