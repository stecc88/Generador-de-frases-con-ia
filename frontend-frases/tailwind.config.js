/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}", // <-- Esto le dice que mire todos los archivos JS y JSX dentro de src
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}