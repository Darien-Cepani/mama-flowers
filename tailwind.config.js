/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Mama Flowers — bold fuchsia & deep plum couture palette
        brand: {
          dark: '#2A0E1C',      // primary ink / body text
          night: '#190711',     // deepest backgrounds (loader, hero, footer)
          gold: '#C4286E',      // signature accent (fuchsia)
          deep: '#9C1E55',      // darker accent for text & hairlines on white
          champagne: '#FBF0F4', // soft section background
          red: '#C01E63',       // highlight / notification accent
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Syne', 'sans-serif'],
        serif: ['Cormorant Garamond', 'serif'],
      }
    },
  },
  plugins: [],
}
