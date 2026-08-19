import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  // --- Dev server configuration ---
  server: {
    // Proxy every request that starts with `/api` to the Express backend.
    // The frontend always calls relative URLs like `/api/notes/generate-notes`,
    // so there are no hard-coded host/port strings in the client code.
    proxy: {
      '/api': {
        // Backend listens on PORT from server/.env (PORT = 8000)
        target: 'http://localhost:8000',

        // Rewrite the Host header to match the backend origin.
        // Required for cookie-based auth (isAuth reads req.cookies.token)
        // and for the backend's CORS allow-list (http://localhost:5173).
        changeOrigin: true,

        // Leave the URL path untouched — the backend expects `/api/...` routes.
        // (No `rewrite` needed here.)
      },
    },
  },
})