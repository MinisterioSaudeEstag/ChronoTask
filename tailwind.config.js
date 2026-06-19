/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Mantenha isso!
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#004785",
        // NOVA PALETA ADAPTATIVA
        cream: "#fdfbf7",    // Bege bem claro para não cansar a vista
        darkBg: "#0f172a",    // Azul Profundo
        darkCard: "#1e293b",  // Azul Card
        statusBlue: "#3b82f6",
        statusYellow: "#eab308",
        statusCyan: "#06b6d4",
        statusGreen: "#22c55e",
        statusRed: "#ef4444",
      },
    },
  },
  plugins: [],
}
