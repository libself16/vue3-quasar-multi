/** @type {import('tailwindcss').Config} */

const { breakpoints } = require('./src/common/utils/constants/breakpoints')

// 將 breakpoints 物件轉換為 Tailwind 的 screens 格式
function generateMaxWidthScreens(breakpoints) {
  const screens = {}

  for (const [key, value] of Object.entries(breakpoints)) {
    screens[key] = { "max": `${value}px` }
  }

  return screens
}

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./template/**/*.{vue,js,ts,jsx,tsx}",
    "!./node_modules/**"
  ],
  theme: {
    extend: {
      screens: {
        ...generateMaxWidthScreens(breakpoints)
      },
    }
  },
  plugins: []
}
