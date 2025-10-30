// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["./app/assets/css/main.css"],

  vite: {
    plugins: [tailwindcss()],
  },

  modules: ["@nuxt/image", "@nuxtjs/color-mode"],

  routeRules: {
    "/dashboard": { ssr: false },
  },
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
