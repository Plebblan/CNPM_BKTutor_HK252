import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  
  server: {
    allowedHosts: [
      "roger-isonomous-nonglacially.ngrok-free.dev"
    ]
  },

  optimizeDeps: {
    include: [ 
      '@fullcalendar/core',
      '@fullcalendar/daygrid',
      '@fullcalendar/timegrid',
      '@fullcalendar/interaction'
    ]
  },

  resolve: {
    dedupe: ['@fullcalendar/common'] // This is crucial
  }
})
