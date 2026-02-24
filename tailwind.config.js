/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sc-dark': '#0f1b35',
        'sc-navy': '#1e3058',
        'sc-slate': '#3d6080',
        'sc-teal': '#4ecdc4',
        'sc-teal-bright': '#6ee7e0',
        'sc-light': '#f0f4ff',
        'sc-muted': '#a8b8d8',
        'sc-accent': '#ff8c42',
      },
      fontFamily: {
        display: ['Cinzel', 'serif'],
        body: ['Raleway', 'sans-serif'],
        accent: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
}
