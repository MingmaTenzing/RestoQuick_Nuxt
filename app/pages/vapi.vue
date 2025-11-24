<script setup lang="js">


onMounted(() => {

    var vapiInstance = null;
      const assistant = "a5801983-f1ae-401f-a06f-7ad5231ec2aa"; // Substitute with your assistant ID
      const apiKey = '326280f7-5532-4764-b83c-04bd4c95008e'; // Substitute with your Public key from Vapi Dashboard.
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
    <p>dfd</p>



</template>