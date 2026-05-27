import { Agent, imageGenerationTool, webSearchTool } from "@openai/agents";
import { menu_tools } from "../agent-tools/menu_tools";
import { shift_tools } from "../agent-tools/shift_tools";
import { staff_tool } from "../agent-tools/staff_tool";
import { rosterAgent } from "./roster-agent";

export const main_agent = Agent.create({
  name: "RestoQuick Assistant",
  model: "gpt-5-mini-2025-08-07",
  handoffs: [rosterAgent],

  instructions: restoquickAgentInstructions,
  tools: [
    webSearchTool(),
    ...leave_request_tools(),
    ...booking_tools(),
    ...menu_tools(),
    ...orders_tools(),
    ...receipt_tool(),
    ...shift_tools(),
    ...staff_tool(),
    ...stock_tools(),
    ...table_tools(),
  ],
});
