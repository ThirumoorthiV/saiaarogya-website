// Design system — maroon-only palette (no orange), warm neutrals, modern type.
// Contrast checked: maroon-700 on white 11.1:1, on maroon-100 9.1:1; ink-600 on white 7.3:1.
import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        maroon: {
          50: "#FBF4F4", // tinted surfaces
          100: "#F6E4E4", // hover / focus background for menus and dropdowns
          200: "#EDCACA", // borders on tinted surfaces, text on dark maroon
          300: "#DFA3A3", // decorative
          400: "#C46F6F", // decorative only
          500: "#A33A3A",
          600: "#8E1E1E",
          700: "#7A0C0C", // brand primary (from the logo)
          800: "#650909", // primary hover
          900: "#4F0707",
          950: "#2E0404", // footer
        },
        ink: {
          50: "#FBF9F7", // page background (ivory)
          100: "#F3EFED",
          200: "#E6DFDC", // borders
          300: "#CFC5C1",
          500: "#857975", // decorative only (4.2:1)
          600: "#5E5450", // secondary text
          700: "#463E3B",
          900: "#241C1A", // body text
        },
        success: { 50: "#E8F3EC", 700: "#1E6B34" },
        alert: { 50: "#FDECEC", 700: "#B91C1C" },
      },
      fontFamily: {
        heading: ['"Plus Jakarta Sans"', "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        "size-display": ["clamp(2.25rem, 1.4rem + 3.6vw, 4rem)", { lineHeight: "1.05", letterSpacing: "-0.03em", fontWeight: "700" }],
        "size-h1": ["clamp(2rem, 1.5rem + 2.2vw, 3.25rem)", { lineHeight: "1.1", letterSpacing: "-0.025em", fontWeight: "700" }],
        "size-h2": ["clamp(1.625rem, 1.3rem + 1.4vw, 2.5rem)", { lineHeight: "1.15", letterSpacing: "-0.02em", fontWeight: "700" }],
        "size-h3": ["1.25rem", { lineHeight: "1.3", letterSpacing: "-0.01em", fontWeight: "650" }],
      },
      borderRadius: { "4xl": "2rem" },
      maxWidth: { content: "1240px", prose: "68ch" },
      boxShadow: {
        soft: "0 1px 2px rgba(36,28,26,.04), 0 8px 24px -8px rgba(36,28,26,.08)",
        lift: "0 2px 4px rgba(36,28,26,.04), 0 20px 40px -12px rgba(79,7,7,.18)",
        menu: "0 24px 60px -16px rgba(46,4,4,.28), 0 2px 6px rgba(46,4,4,.06)",
      },
      keyframes: {
        "fade-up": { "0%": { opacity: "0", transform: "translateY(10px)" }, "100%": { opacity: "1", transform: "none" } },
        "menu-in": { "0%": { opacity: "0", transform: "translateY(-6px) scale(.98)" }, "100%": { opacity: "1", transform: "none" } },
      },
      animation: {
        "fade-up": "fade-up 280ms ease-out both",
        "menu-in": "menu-in 160ms ease-out both",
      },
    },
  },
  plugins: [],
} satisfies Config;
