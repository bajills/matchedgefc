import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#080D1A",
          50: "#E8EAF0",
          100: "#C5CAD8",
          200: "#9AA3B8",
          300: "#6F7B98",
          400: "#4A5878",
          500: "#2E3A5C",
          600: "#1F2840",
          700: "#141C30",
          800: "#0C1220",
          900: "#080D1A",
          950: "#050810",
        },
        edge: {
          DEFAULT: "#00C853",
          dim: "#00A344",
          glow: "#33D975",
        },
      },
      fontFamily: {
        heading: ["var(--font-rajdhani)", "system-ui", "sans-serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        edge: "0 0 24px rgba(0, 200, 83, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
