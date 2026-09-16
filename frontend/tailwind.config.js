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
        // "The Ledger" — a graded operating ledger, not a wellness app.
        // Restrained strategy: neutral ink/paper carry the surface; red is
        // functional only (accounting's "in the red"), never decorative.
        paper: {
          DEFAULT: "#F2F1ED",
          raised: "#FFFFFF",
          sunken: "#E8E6DF",
        },
        ink: {
          DEFAULT: "#141311",
          soft: "#524F47",
          faint: "#6B675E",
        },
        rule: {
          DEFAULT: "#D9D6CC",
          strong: "#B9B6AA",
        },
        ledger: {
          red: "#A32E22",
          "red-soft": "#F4E4DF",
          black: "#141311",
        },
      },
      fontFamily: {
        sans: ["Archivo", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.04em",
      },
    },
  },
  plugins: [],
};
