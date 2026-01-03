// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["./app/assets/css/main.css"],

  vite: {
    plugins: [tailwindcss()],
  },

  modules: [
    "@nuxt/image",
    "nuxt-qrcode",
    "@nuxtjs/color-mode",
    "nuxt-toast",
    "@nuxt/scripts",
    "@unlok-co/nuxt-stripe",
    "nuxt-time",
  ],

  nitro: {
    experimental: {
      websocket: true,
    },
  },

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
    HOST: process.env.HOST,
    WEBSOCKET_HOST: process.env.WEBSOCKET_HOST,
    stripe: {
      key: process.env.STRIPE_SECRET_KEY,
    },

    public: {
      VAPI_PUBLIC_KEY: process.env.NUXT_VAPI_PUBLIC_KEY,
      VAPI_ASSISTANT_KEY: process.env.NUXT_VAPI_ASSISTANT_KEY,
      WEBSOCKET_HOST: process.env.WEBSOCKET_HOST,

      HOST: process.env.HOST,
      stripe: {
        key: process.env.STRIPE_PUBLIC_KEY,

        // manualClientLoad: true,
      },
    },
  },
});
