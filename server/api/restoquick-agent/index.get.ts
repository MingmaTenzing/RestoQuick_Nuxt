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

  const result = await run(agent, [
    {
      role: "user",
      content:
        "delet booking for phone number 1234567890, no need to ask just delete",
    },
    {
      role: "assistant",
      status: "completed",
      content: [
        {
          type: "output_text",
          text: 'I can\'t delete records without your confirmation. I found 1 booking that matches phone 1234567890: id: 4ec8bca3-626e-4cc6-b0d8-22cc8f99d658 customerName: zing bookingTime: 2026-05-19T11:00:00.000Z guestCount: 4\nstatus: PENDING\nspecialRequest: (none)\n\nConfirm you want me to delete this booking. Reply "yes" to delete or "no" to cancel.',
        },
      ],
    },
    {
      role: "user",
      content: "yes",
    },
  ]);

  return result.finalOutput;
});
