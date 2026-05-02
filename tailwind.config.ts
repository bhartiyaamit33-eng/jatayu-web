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
        navy: "#13233F",
        indigo: "#243F86",
        blue: "#2F5597",
        purple: "#7C4481",
        magenta: "#8B3A9E",
        lavender: "#D0D1EC",
        "pale-blue": "#EEF4FF",
        slate: "#5F6B7A",
        canvas: "#F7F9FF",
      },
      fontFamily: {
        display: ["var(--font-sora)", "system-ui", "sans-serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
      },
      backgroundImage: {
        "grad-accent": "linear-gradient(135deg, #243F86, #7C4481)",
        "grad-hero":
          "linear-gradient(145deg, #EEF4FF 0%, #F3EEF8 50%, #EAF0FF 100%)",
        "grad-cta":
          "linear-gradient(135deg, #0e1e3d 0%, #1a2d68 50%, #3d1a5e 100%)",
      },
      boxShadow: {
        nav: "0 1px 12px rgba(19,35,63,0.06)",
        card: "0 4px 24px rgba(19,35,63,0.06)",
        elevated: "0 20px 60px rgba(19,35,63,0.12)",
      },
      transitionTimingFunction: {
        clinical: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};
export default config;
