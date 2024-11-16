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
  daisyui: {
    styled: true,
    themes: ["light"],
    base: true,
    utils: true,
    logs: false,
    rtl: false,
    prefix: "d-",
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
};
