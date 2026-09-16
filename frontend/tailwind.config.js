/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        sage: {
          50: "#f4f7f4",
          100: "#e6ede6",
          200: "#cddfcd",
          300: "#a9c0a9",
          400: "#7f9d7f",
          500: "#5f8060",
          600: "#4a664b",
          700: "#3d523e",
          800: "#334334",
          900: "#2b382c",
        },
        clay: {
          50: "#fbf6f2",
          100: "#f5e8de",
          200: "#e9cdb7",
          300: "#dcac89",
          400: "#cd8a5f",
          500: "#bd6f40",
          600: "#a55834",
          700: "#87442c",
          800: "#6e3828",
          900: "#5c2f24",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ["'Fraunces'", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};
