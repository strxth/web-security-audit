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
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "Cascadia Code", "monospace"],
      },
      colors: {
        critical: {
          DEFAULT: "#ef4444",
          50: "#fef2f2",
          100: "#fecaca",
          600: "#dc2626",
        },
        high: {
          DEFAULT: "#f97316",
          50: "#fff7ed",
          100: "#fed7aa",
          600: "#ea6c00",
        },
        medium: {
          DEFAULT: "#eab308",
          50: "#fefce8",
          100: "#fef08a",
          600: "#ca8a04",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.2s ease-out",
        "slide-down": "slideDown 0.25s ease-out",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideDown: {
          from: { opacity: "0", transform: "translateY(-6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
