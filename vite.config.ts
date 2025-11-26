import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/umair.archviz/',  // ⚠️ repo name yahi hai, isliye ye line zaroor rakho
})
