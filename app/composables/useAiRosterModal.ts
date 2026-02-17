import type { Staff } from "~/generated/prisma/client";
import type { Shift_With_Staff_Payload } from "~~/types/shift_include_staff";
import { type RosterAgentStructuredOutput } from "~~/zod_schema/roster_agent_schema";

interface AiRosterResponse {
  shifts: Shift_With_Staff_Payload[];
  assistantMessage: {
    content: string;
    caution: string;
  };
}

export const useAiRosterModal = () => {
  const isOpen = useState<boolean>("ai-roster-modal", () => false);

  const ai_response = useState<AiRosterResponse>("ai-roster-response", () => ({
    shifts: [],
    assistantMessage: {
      content: "",
      caution: "",
    },
  }));

  const open = () => {
    isOpen.value = true;
  };
  const close = () => {
    isOpen.value = false;
  };

  const send_prompt = async (message: string) => {
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
    console.log(mapped_response);
    return (ai_response.value = {
      shifts: mapped_response,
      assistantMessage: response.assistantMessage,
    });
  };

  return {
    isOpen,
    open,
    close,
    ai_response,
    send_prompt,
  };
};
