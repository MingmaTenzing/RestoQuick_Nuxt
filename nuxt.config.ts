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
    "@vite-pwa/nuxt",
  ],

  pwa: {
    registerType: "autoUpdate",
    includeAssets: ["favicon.ico", "robots.txt"],
    manifest: {
      name: "RestoQuick",
      short_name: "RestoQuick",
      description: "Restaurant order management system",
      theme_color: "#0f172a",
      background_color: "#ffffff",
      display: "standalone",
      start_url: "/",
      scope: "/",
      icons: [
        { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
        { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
        {
          src: "/icons/icon-512-maskable.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "maskable",
        },
      ],
    },
  },

  nitro: {
    experimental: {
      websocket: true,
    },
  },

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
    VAPI_PUBLIC_KEY: process.env.NUXT_VAPI_PUBLIC_KEY,
    VAPI_ASSISTANT_KEY: process.env.NUXT_VAPI_ASSISTANT_KEY,
    DATABASE_URL: process.env.DATABASE_URL,
    BASE_URL: process.env.BASE_URL,
    WEBSOCKET_HOST: process.env.WEBSOCKET_HOST,
    stripe: {
      key: process.env.STRIPE_SECRET_KEY,
    },

    CLOUDINARY_API_SECRET_KEY: process.env.CLOUDINARY_API_SECRET_KEY,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_UPLOAD_PRESET: process.env.CLOUDINARY_UPLOAD_PRESET,

    public: {
      VAPI_PUBLIC_KEY: process.env.NUXT_VAPI_PUBLIC_KEY,
      VAPI_ASSISTANT_KEY: process.env.NUXT_VAPI_ASSISTANT_KEY,
      WEBSOCKET_HOST: process.env.WEBSOCKET_HOST,

      BASE_URL: process.env.BASE_URL,
      stripe: {
        key: process.env.STRIPE_PUBLIC_KEY,

        // manualClientLoad: true,
      },
    },
  },
});
