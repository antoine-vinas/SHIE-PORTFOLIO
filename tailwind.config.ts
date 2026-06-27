import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--color-background)",
        surface: "var(--color-surface)",
        heading: "var(--color-heading)",
        body: "var(--color-body)",
        accent: "var(--color-accent)",
        hairline: "var(--color-hairline)",
      },
      fontFamily: {
        display: ["BirdsOfParadise", "cursive"],
        sans: ["HelveticaNeue", "Helvetica", "Arial", "sans-serif"],
      },
      borderRadius: {
        card: "20px",
      },
      transitionDuration: {
        wordmark: "250ms",
      },
    },
  },
  plugins: [],
};

export default config;
