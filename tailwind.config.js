// tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx}"],
  mode: "jit",
  theme: {
    extend: {
      colors: {
        primary: "#050816",
        secondary: "#aaa6c3",
        tertiary: "#151030",
        "black-100": "#100d25",
        "black-200": "#090325",
        "white-100": "#f3f3f3",
        "color-1": "hsl(var(--color-1))",
        "color-2": "hsl(var(--color-2))",
        "color-3": "hsl(var(--color-3))",
        "color-4": "hsl(var(--color-4))",
        "color-5": "hsl(var(--color-5))",
        // Glass morphism colors
        "glass": {
          "primary": "rgba(255, 255, 255, 0.15)",
          "secondary": "rgba(255, 255, 255, 0.08)",
          "accent": "rgba(145, 94, 255, 0.25)",
          "border": "rgba(255, 255, 255, 0.2)",
          "hover": "rgba(255, 255, 255, 0.25)",
          "active": "rgba(255, 255, 255, 0.35)",
        },
      },
      boxShadow: {
        card: "0px 35px 120px -15px #211e35",
        "glass": "0 8px 32px rgba(31, 38, 135, 0.37)",
        "glass-lg": "0 12px 40px rgba(31, 38, 135, 0.5)",
        "glass-accent": "0 4px 20px rgba(145, 94, 255, 0.4)",
        "glass-glow": "0 0 0 4px rgba(145, 94, 255, 0.2)",
      },
      screens: {
        xs: "450px",
      },
      backgroundImage: {
        // "hero-pattern": "url('/src/assets/herobg.png')",
      },
      animation: {
        marquee: "marquee var(--duration) linear infinite",
        "marquee-vertical": "marquee-vertical var(--duration) linear infinite",
        grid: "grid 15s linear infinite",
        rainbow: "rainbow var(--speed, 2s) infinite linear",
        "glass-appear": "glassAppear 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
        "glass-float": "glassFloat 3s ease-in-out infinite",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(calc(-100% - var(--gap)))" },
        },
        "marquee-vertical": {
          from: { transform: "translateY(0)" },
          to: { transform: "translateY(calc(-100% - var(--gap)))" },
        },
        grid: {
          "0%": { transform: "translateY(-50%)" },
          "100%": { transform: "translateY(0)" },
        },
        rainbow: {
          "0%": { "background-position": "0%" },
          "100%": { "background-position": "200%" },
        },
        glassAppear: {
          "0%": {
            opacity: "0",
            backdropFilter: "blur(0px)",
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: "1",
            backdropFilter: "blur(16px)",
            transform: "translateY(0)",
          },
        },
        glassFloat: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      backdropBlur: {
        'glass-sm': '8px',
        'glass-md': '12px',
        'glass-lg': '16px',
        'glass-xl': '20px',
        'glass-2xl': '32px',
      },
    },
  },
  plugins: [],
};
