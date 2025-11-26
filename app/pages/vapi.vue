<script setup lang="js">


onMounted(() => {

    var vapiInstance = null;
      const assistant = process.env.VAPI_ASSISTANT_ID; // Substitute with your assistant ID
      const apiKey = process.env.VAPI_AI_PUBLIC_KEY; // Substitute with your Public key from Vapi Dashboard.
      const buttonConfig = {}; // Modify this as required
      (function (d, t) {
        var g = document.createElement(t),
          s = d.getElementsByTagName(t)[0];
        g.src =
          "https://cdn.jsdelivr.net/gh/VapiAI/html-script-tag@latest/dist/assets/index.js";
        g.defer = true;
        g.async = true;
        s.parentNode.insertBefore(g, s);
        g.onload = function () {
          vapiInstance = window.vapiSDK.run({
            apiKey: apiKey, // mandatory   
            assistant: assistant, // mandatory
            config: buttonConfig, // optional
          });
        };
      })(document, "script");
})
</script>
<template>
    <p>this is vapi assistants</p>



</template>