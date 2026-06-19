/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // ESSENCIAL para o botão de modo escuro funcionar
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#004785",
        darkBg: "#0f172a",     // Azul Profundo (Modo Escuro)
        darkCard: "#1e293b",   // Azul Card (Modo Escuro)
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
