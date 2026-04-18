/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'chess-dark': '#1a1a2e',
        'chess-light': '#16213e',
        'chess-accent': '#0f3460',
        'chess-gold': '#e94560',
        'chess-cream': '#f5f5f5',
      }
    },
  },
  plugins: [],
}