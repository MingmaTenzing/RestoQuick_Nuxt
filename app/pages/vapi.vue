<script>
useHead({
    script: [
        {
            src: "https://unpkg.com/@vapi-ai/client-sdk-react/dist/embed/widget.umd.js",
            async: true,
            type: 'text/javascript'
        
    }
]

})
</script>

<template>
    <vapi-widget
  public-key="326280f7-5532-4764-b83c-04bd4c95008e"
  assistant-id="a5801983-f1ae-401f-a06f-7ad5231ec2aa"
  mode="voice"
  theme="dark"
  base-bg-color="#000000"
  accent-color="#14B8A6"
  cta-button-color="#000000"
  cta-button-text-color="#ffffff"
  border-radius="large"
  size="full"
  position="bottom-right"
  title="TALK WITH AI"
  start-button-text="Start"
  end-button-text="End Call"
  chat-first-message="Hey, How can I help you today?"
  chat-placeholder="Type your message..."
  voice-show-transcript="true"
  consent-required="true"
  consent-title="Terms and conditions"
  consent-content="By clicking Agree, and each time I interact with this AI agent, I consent to the recording, storage, and sharing of my communications with third-party service providers, and as otherwise described in our Terms of Service."
  consent-storage-key="vapi_widget_consent"
></vapi-widget>


</template>