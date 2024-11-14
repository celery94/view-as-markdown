module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx,html}"],
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
    prefix: "d-", // 添加前缀配置
  },
  plugins: [require("daisyui")],
};
