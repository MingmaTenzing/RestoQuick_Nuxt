<script setup lang="js">

const runtimeConfig = useRuntimeConfig();





    var vapiInstance = null;
      const buttonConfig = {
     color:white

 
};; // Modify this as required
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
            apiKey: runtimeConfig.public.VAPI_PUBLIC_KEY, // mandatory   
            assistant: runtimeConfig.public.VAPI_ASSISTANT_KEY, // mandatory
          buttonConfig: buttonConfig
          });
        };
        if (vapiInstance) {
  
          vapiInstance.on('call-start', () => {
              console.log('call started')
            })
            
           vapiInstance.on('call-end', () => {
              console.log('call ended')
            })
           vapiInstance.on('speech-start', () => {
              console.log('speech started')
            })
            
           vapiInstance.on('speech-end', () => {
              console.log('speech end')
            }
            )
           vapiInstance.on('message', (message) => {
              console.log(message)
            })
}




        
      }



      )(document, "script");

  
</script>
<template>
  



</template>