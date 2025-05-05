/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "selector",
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        main: "var(--main)",
      },
    },
  },
  plugins: [],
}
