/** @type {import('tailwindcss').Config} */
module.exports = {
  // Añade ./src/**/*.{js,jsx,ts,tsx} si tienes componentes dentro de src/
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
};