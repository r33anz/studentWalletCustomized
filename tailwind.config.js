const colors = require("@tailwindcss/postcss7-compat/colors");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        ...colors,
        cambridge: "#82A7A6",
        maize: "#FDE74C",
        cinnabar: "#E55934",
        skyblue: "#9ED0E6",
      },
    },
  },
  plugins: [],
}