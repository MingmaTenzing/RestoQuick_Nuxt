import { VapiClient } from "@vapi-ai/server-sdk";
export default defineEventHandler(async (event) => {
  const runtime = useRuntimeConfig();

  const vapi = new VapiClient({
    token: "dd62d43d-5d5a-4cb2-adc9-ac0be804e65c",
  });

  return await vapi.calls.create({
    transport: {
      provider: "vapi.websocket",
      audioFormat: {
        format: "pcm_s16le",
        container: "raw",
        sampleRate: 16000,
      },
    },

    assistantId: runtime.VAPI_ASSISTANT_KEY,
  });
});
