/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: '', 
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#004785",
        cream: "#fdfbf7",
        darkBg: "#0f172a",
        darkCard: "#1e293b",
      },
    },
  },
  plugins: [],
}