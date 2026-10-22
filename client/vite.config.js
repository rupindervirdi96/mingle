import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const API = process.env.MINGLE_API || "http://localhost:5000";

export default defineConfig({
  plugins: [react()],
  build: {
    // server.js serves client/build in production
    outDir: "build",
    sourcemap: false,
  },
  server: {
    port: 3000,
    proxy: {
      "/api": API,
      "/socket.io": { target: API, ws: true },
    },
  },
});
