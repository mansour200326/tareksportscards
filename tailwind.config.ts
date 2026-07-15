import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./sanity/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          DEFAULT: "#141414",
          50: "#f6f6f6",
          800: "#1c1c1c",
          900: "#141414",
          950: "#0d0d0d",
        },
        cream: "#f4f1ea",
        gold: {
          DEFAULT: "#c8a24a",
          light: "#e0c476",
          dark: "#a3822f",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        "8xl": "88rem",
      },
    },
  },
  plugins: [],
};

export default config;
