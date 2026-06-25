import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Relative base so the same build works at the site root or under a
// GitHub Pages project subpath (https://user.github.io/<repo>/).
export default defineConfig({
  base: './',
  plugins: [react()],
})