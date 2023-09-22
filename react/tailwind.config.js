/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: ["Helvetica", "Arial", "sans-serif"],
      serif: ["ui-serif", "Georgia"],
      mono: ["ui-monospace", "SFMono-Regular"],
    },
    extend: {
      colors: {
        arzumaBlack: "#222222",
        arzumaOrange: "#F68230",
        arzumaRed: "#DC0146",
        nav: "#525b75",
      },
    },
  },
  plugins: [],
};
