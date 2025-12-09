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
    "/vapi-test": {
      ssr: false,
    },
  },

  router: {
    options: {
      scrollBehaviorType: "smooth",
    },
  },

  runtimeConfig: {
    VAPI_PUBLIC_KEY: process.env.NUXT_VAPI_PUBLIC_KEY,
    VAPI_ASSISTANT_KEY: process.env.NUXT_VAPI_ASSISTANT_KEY,
    DATABASE_URL: process.env.DATABASE_URL,

    public: {
      VAPI_PUBLIC_KEY: process.env.NUXT_VAPI_PUBLIC_KEY,
      VAPI_ASSISTANT_KEY: process.env.NUXT_VAPI_ASSISTANT_KEY,
    },
  },
});
