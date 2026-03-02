import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Pin to 5173 with strictPort so Vite never reads PORT from the shell env.
    // Without this, PORT=3001 (set for Express) leaks into Vite and causes a port conflict.
    port: 5173,
    strictPort: true,
  },
})
