/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Purple-White Theme System
        purple: {
          50: "#F8F5FF",
          100: "#F3E8FF",
          200: "#E9D5FF",
          300: "#D8B4FE",
          400: "#C084FC",
          500: "#A855F7",
          600: "#9333EA",
          700: "#7E22CE",
          800: "#6B21A8",
          900: "#5B21B6",
          950: "#3F0F5C",
        },
        primary: {
          purple: "#7C3AED",
          "purple-dark": "#6D28D9",
          "purple-light": "#F3E8FF",
        },
        bg: {
          main: "#FFFFFF",
          alt: "#F9FAFB",
          light: "#F3E8FF",
        },
        text: {
          main: "#1F2937",
          secondary: "#6B7280",
          light: "#9CA3AF",
        },
        success: "#22C55E",
        warning: "#F59E0B",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Poppins", "sans-serif"],
      },
      spacing: {
        xs: "4px",
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
        "2xl": "32px",
        "3xl": "40px",
        "4xl": "56px",
        "5xl": "80px",
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "20px",
      },
      boxShadow: {
        "soft-sm": "0 2px 8px rgba(124, 58, 237, 0.08)",
        "soft-md": "0 4px 16px rgba(124, 58, 237, 0.10)",
        "soft-lg": "0 8px 24px rgba(124, 58, 237, 0.12)",
        "purple-glow": "0 0 20px rgba(124, 58, 237, 0.20)",
      },
    },
  },
  plugins: [],
}
