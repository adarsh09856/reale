/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bhutan: {
          crimson: '#9e1b27',
          darkRed: '#7f1d1d',
          gold: '#d97706',
          amber: '#f59e0b',
          navy: '#0f172a',
          darkNavy: '#090d16',
          border: '#e2e8f0',
          bg: '#fafaf9'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Cinzel', 'Playfair Display', 'serif'],
        serif: ['Merriweather', 'serif']
      }
    },
  },
  plugins: [],
}
