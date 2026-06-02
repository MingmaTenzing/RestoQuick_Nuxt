import { tool } from "@openai/agents";
import z from "zod";

export const analytics_tools = () => {
  const get_weekly_sales = tool({
    name: "get_weekly_sales",
    description:
      "Tool to get the week's sales details by calling the weekly KPI dashboard endpoint.",
    parameters: z.object({}),
    execute: async () => {
      return $fetch("/api/dashboard/stats/weekly-kpi");
    },
  });

  return [get_weekly_sales];
};
