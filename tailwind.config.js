/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', 
  
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#004785",
          dark: "#003566",
          light: "#005bb3",
        },
        darkBg: "#0f172a",     // Fundo Azul Profundo
        darkCard: "#1e293b",   // Fundo dos Cards

        statusBlue: "#3b82f6",   // Total/Em Andamento
        statusYellow: "#eab308", // Pendentes
        statusCyan: "#06b6d4",   // Em Andamento (Variante)
        statusGreen: "#22c55e",  // Concluídas
        statusRed: "#ef4444",    // Atrasadas
      },
    },
  },
  plugins: [],
}
