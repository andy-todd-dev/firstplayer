import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import pwaManifest from "./pwa_manifest";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), pwaManifest],
  server: {
    cors: true,
  },
});
