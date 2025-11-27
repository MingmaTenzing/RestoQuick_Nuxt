// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["./app/assets/css/main.css"],

  vite: {
    plugins: [tailwindcss()],
  },

  modules: ["@nuxt/image", "@nuxtjs/color-mode", "nuxt-toast", "@nuxt/scripts"],

  routeRules: {
    "/dashboard": { ssr: false },
    "/vapi": { ssr: false },
  },

  router: {
    options: {
      scrollBehaviorType: "smooth",
    },
  },

  runtimeConfig: {
    public: {
      VAPI_PUBLIC_KEY: process.env.NUXT_VAPI_PUBLIC_KEY,
      VAPI_ASSISTANT_KEY: process.env.NUXT_VAPI_ASSISTANT_KEY,
    },
  },

  // app: {
  //   head: {
  //     title: "Resto Quick",
  //     script: [
  //       {
  //         defer: "true",
  //         src: "https://unpkg.com/@vapi-ai/client-sdk-react/dist/embed/widget.umd.js",
  //         type: "text/javascript",
  //       },
  //     ],
  //   },
  // },
  // colorMode: {
  //   preference: "system", // default value of $colorMode.preference
  //   fallback: "dark", // fallback value if not system preference found
  //   hid: "nuxt-color-mode-script",
  //   globalName: "__NUXT_COLOR_MODE__",
  //   componentName: "ColorScheme",
  //   classPrefix: "",
  //   classSuffix: "",
  //   storage: "localStorage", // or 'sessionStorage' or 'cookie'
  //   storageKey: "nuxt-color-mode",
  // },
});
