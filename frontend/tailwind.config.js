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
        // Scoped to the public Landing page only (see Landing.jsx) — an
        // intentional, separate "storefront" palette that does not touch
        // the app's Ledger design system used everywhere past sign-in.
        warm: {
          cream: "#FBF6ED",
          accent: "#E2522C",
          "accent-dark": "#C4562C",
          forest: "#14302A",
          ink: "#201B15",
          soft: "#6B6255",
          faint: "#9A9186",
          rule: "#EFE4D2",
        },
      },
      fontFamily: {
        sans: ["Archivo", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
        display: ["'Playfair Display'", "Georgia", "serif"],
        warm: ["Poppins", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        tightest: "-0.04em",
      },
    },
  },
  plugins: [],
};
