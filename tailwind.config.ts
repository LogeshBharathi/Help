import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "var(--ink)",
        muted: "var(--muted)",
        line: "var(--line)",
        accent: {
          DEFAULT: "var(--accent)",
          strong: "var(--accent-strong)",
        },
        surface: {
          DEFAULT: "var(--surface)",
          soft: "var(--surface-soft)",
        },
        hero: {
          deep: "var(--hero-deep)",
          mid: "var(--hero-mid)",
        },
      },
      boxShadow: {
        panel: "0 20px 60px rgba(16, 36, 62, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
