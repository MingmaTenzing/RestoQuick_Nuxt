import type { Staff } from "~/generated/prisma/client";
import type { Shift_With_Staff_Payload } from "~~/types/shift_include_staff";
import { type RosterAgentStructuredOutput } from "~~/zod_schema/roster_agent_schema";

interface AI_Conversation {
  role: "AI" | "USER";
  content: string;
  caution?: string;
}
interface AiRosterResponse {
  shifts: Shift_With_Staff_Payload[];
  assistantMessage: AI_Conversation[];
}

export const useAiRosterModal = () => {
  const isOpen = useState<boolean>("ai-roster-modal", () => false);

  const response_loading = useState<boolean>("ai-respone-loading", () => false);

  const ai_conversation = useState<AiRosterResponse>(
    "ai-roster-conversation",
    () => ({
      shifts: [],
      assistantMessage: [],
    }),
  );

  const open = () => {
    isOpen.value = true;
  };
  const close = () => {
    isOpen.value = false;
  };

  const send_prompt = async (message: string) => {
    //setting the loading state and pushing the message to conversation array
    response_loading.value = true;
    ai_conversation.value.assistantMessage.push({
      role: "USER",
      content: message,
    });

    const response = await $fetch<RosterAgentStructuredOutput>(
      "/api/roster-agent",
      {
        method: "POST",
        body: {
          message,
        },
      },
    );

    const staffs = await $fetch<Staff[]>("/api/staff");
    const staffById = new Map(staffs.map((staff) => [staff.id, staff]));

    //mapped the response to match with shift_with_staff_payload
    const mapped_response = response.shifts.reduce<Shift_With_Staff_Payload[]>(
      (acc, shift) => {
        const get_staff = staffById.get(shift.staffId);

        if (!get_staff) {
          return acc;
        }

        acc.push({
          id: crypto.randomUUID(),
          position: "",
          endTime: shift.endTime,
          startTime: shift.startTime,
          staffId: shift.staffId,
          date: new Date(shift.date),
          staff: get_staff,
        });

        return acc;
      },
      [],
    );
    response_loading.value = false;

    ai_conversation.value.shifts = mapped_response;
    ai_conversation.value.assistantMessage.push({
      role: "AI",
      content: response.assistantMessage.content,
      caution: response.assistantMessage.caution,
    });
    return ai_conversation.value;
  };

  return {
    isOpen,
    open,
    close,
    ai_conversation,
    send_prompt,
    response_loading,
  };
};
