module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx,html}"],
  important: "#view-as-markdown-extension",
  theme: {
    extend: {
      zIndex: {
        999: 999,
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
