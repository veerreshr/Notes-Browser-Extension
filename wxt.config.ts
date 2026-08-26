import { defineConfig } from "wxt";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  manifest: {
    name: "Site Notes",
    description: "Take notes on any website — stored locally per URL or domain",
    permissions: ["storage", "activeTab", "sidePanel", "tabs"],
    action: {
      default_title: "Open Site Notes",
      default_icon: {
        "16": "icon-16.png",
        "48": "icon-48.png",
        "128": "icon-128.png",
      },
    },
    icons: {
      "16": "icon-16.png",
      "48": "icon-48.png",
      "128": "icon-128.png",
    },
  },
  vite: () => ({
    plugins: [tailwindcss() as any],
  }),
});
