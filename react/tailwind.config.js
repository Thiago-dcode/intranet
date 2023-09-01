/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        arzumaBlack: '#222222',
        arzumaOrange: '#F68230',
        arzumaRed: '#DC0146'
      }
    },
  },
  plugins: [],
}

