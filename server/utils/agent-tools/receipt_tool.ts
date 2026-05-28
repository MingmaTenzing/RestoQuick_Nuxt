import { tool } from "@openai/agents";
import z from "zod";

export const receipt_tool = () => {
  const print_receipt = tool({
    name: "print_receipt",
    description:
      "Print a table session receipt by calling the print-receipt API with a session id and printer IP.",
    parameters: z.object({
      sessionId: z.string().min(1),
      printerIp: z.string().min(1),
    }),
    execute: async ({ sessionId, printerIp }) => {
      const response = await $fetch(`/api/print-receipt/${sessionId}`, {
        method: "POST",
        body: {
          printerIp,
        },
      });

      return response;
    },
  });

  return [print_receipt];
};
