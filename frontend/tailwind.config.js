/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    screens: {
      xs: "420px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        // One warm system, used everywhere in the app (marketing and
        // signed-in screens alike): cream ground, terracotta accent,
        // forest-green dark surfaces, near-black ink text.
        paper: {
          DEFAULT: "#FBF6ED",
          raised: "#FFFFFF",
          sunken: "#F0E6D3",
        },
        ink: {
          DEFAULT: "#201B15",
          soft: "#6B6255",
          faint: "#786F60",
        },
        rule: {
          DEFAULT: "#EFE4D2",
          strong: "#DDAF6C",
        },
        accent: {
          DEFAULT: "#E2522C",
          dark: "#C4562C",
          soft: "#FCE8DD",
        },
        forest: {
          DEFAULT: "#14302A",
          soft: "#C9C1AF",
        },
      },
      fontFamily: {
        sans: ["Poppins", "system-ui", "sans-serif"],
        display: ["'Playfair Display'", "Georgia", "serif"],
      },
      letterSpacing: {
        tightest: "-0.02em",
      },
    },
  },
  plugins: [],
};
