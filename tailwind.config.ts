// Maroon design system — see requirements §6 and §7.2
import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        maroon: { 50: "#FBEFEF", 700: "#7A0C0C", 900: "#5A0808" },
        saffron: { 500: "#F07E1E", 700: "#C2410C" },
        gold: { 400: "#F4B740" },
        cream: { 100: "#F8F1E4" },
        ink: { 600: "#5E5450", 900: "#2B2220" },
        success: { 700: "#1E6B34" },
        alert: { 700: "#B91C1C" },
      },
      fontFamily: {
        heading: ["Jost", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        telugu: ["Noto Sans Telugu", "sans-serif"],
      },
      fontSize: {
        // §6.3 type scale (mobile values; desktop applied with md: prefix)
        h1: ["2.125rem", { lineHeight: "1.2", fontWeight: "500" }], // 34px
        "h1-lg": ["3.5rem", { lineHeight: "1.2", fontWeight: "500" }], // 56px
        h2: ["1.75rem", { lineHeight: "1.2", fontWeight: "500" }], // 28px
        "h2-lg": ["2.5rem", { lineHeight: "1.2", fontWeight: "500" }], // 40px
        h3: ["1.25rem", { lineHeight: "1.25", fontWeight: "500" }], // 20px
        "h3-lg": ["1.5rem", { lineHeight: "1.25", fontWeight: "500" }], // 24px
      },
      borderRadius: { card: "16px", btn: "12px" },
      maxWidth: { content: "1200px", prose: "70ch" },
      boxShadow: { card: "0 4px 20px rgba(0,0,0,.06)" },
      spacing: { section: "96px", "section-sm": "56px" },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: { "fade-up": "fade-up 250ms ease-out both" },
    },
  },
  plugins: [],
} satisfies Config;
