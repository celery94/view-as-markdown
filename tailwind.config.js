module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx,html}"],
  theme: {
    extend: {
      zIndex: {
        999: 999,
      },
    },
  },
  plugins: [require("daisyui")],
};
