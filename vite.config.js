import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: './', // Set the base path to the root if your app is deployed in a subdirectory
  plugins: [react()],
})
