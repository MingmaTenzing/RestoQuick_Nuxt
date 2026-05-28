import {
  Agent,
  hostedMcpTool,
  imageGenerationTool,
  webSearchTool,
} from "@openai/agents";
import { menu_tools } from "../agent-tools/menu_tools";
import { shift_tools } from "../agent-tools/shift_tools";
import { staff_tool } from "../agent-tools/staff_tool";
import { rosterAgent } from "./roster-agent";
import { Composio } from "@composio/core";

export const useMainAgent = async () => {
  const composio = new Composio();
  const userId = "user_33455";

  const session = await composio.create(userId);

  const main_agent = Agent.create({
    name: "RestoQuick Assistant",
    model: "gpt-5-mini-2025-08-07",
    handoffs: [rosterAgent],

    instructions: restoquickAgentInstructions,
    tools: [
      hostedMcpTool({
        serverLabel: "composio",
        serverUrl: session.mcp.url,
        headers: session.mcp.headers,
      }),
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
  return { main_agent };
};
