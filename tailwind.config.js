/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "selector",
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        bg1: "var(--bg1)",
        main: "var(--main)",
      },
    },
  },
  plugins: [],
}
