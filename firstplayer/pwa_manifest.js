import { VitePWA } from "vite-plugin-pwa";

const pwaManifest = VitePWA({
  registerType: "autoUpdate",
  manifest: {
    name: "First Player",
    short_name: "FP",
    description: "An app to pick a first player for a board game",
    start_url: ".",
    display: "standalone",
    theme_color: "#ffffff",
    icons: [
      {
        src: "pwa-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "pwa-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "pwa-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable",
      },
    ],
    includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
  },
});

export default pwaManifest;
