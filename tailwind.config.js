var colors = require("@tailwindcss/postcss7-compat/colors");

var { lightBlue, ...safeColors } = colors;

module.exports = {
  purge: {
    enabled: process.env.NODE_ENV === "production" || process.env.WEBPACK_MODE === "production",
    content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  },
  theme: {
    extend: {
      colors: {
        ...safeColors,
        coral: {
          DEFAULT: "#EA905E",
          light: "#F0A878",
          dark: "#D4724A",
          bg: "rgba(234,144,94,0.10)",
          border: "rgba(234,144,94,0.25)",
        },
        ocean: {
          DEFAULT: "#2A6F7F",
          light: "#3A8A9C",
          dark: "#1E5562",
          bg: "rgba(42,111,127,0.08)",
        },
        surface: {
          DEFAULT: "#FEF5EE",
          card: "#FFFFFF",
          input: "#FFF9F5",
          hover: "#FDF0E6",
          muted: "#F5EDE6",
        },
        border: {
          DEFAULT: "#E8DDD5",
          focus: "#EA905E",
        },
        danger: {
          DEFAULT: "#E05252",
          light: "#E87070",
          bg: "rgba(224,82,82,0.08)",
        },
        success: {
          DEFAULT: "#2EAD6B",
          light: "#3EC97E",
          bg: "rgba(46,173,107,0.08)",
        },
        warning: {
          DEFAULT: "#E5A030",
          light: "#F0B54A",
          bg: "rgba(229,160,48,0.08)",
        },
        info: {
          DEFAULT: "#4A90D9",
          light: "#6BABF0",
          bg: "rgba(74,144,217,0.08)",
        },
        "overlay": "rgba(30,30,30,0.45)",
      },
      boxShadow: {
        card: "0 1px 4px rgba(180,150,120,0.08), 0 1px 2px rgba(180,150,120,0.04)",
        elevated: "0 8px 24px rgba(180,150,120,0.12)",
      },
    },
  },
  plugins: [],
}
