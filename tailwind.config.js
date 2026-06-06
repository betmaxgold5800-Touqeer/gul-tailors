/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: '#1a1006',
        gold: '#c9952a',
        gold2: '#e8b84b',
        cream: '#fdf6e9',
        cream2: '#f5e8cc',
      }
    },
  },
  plugins: [],
}
