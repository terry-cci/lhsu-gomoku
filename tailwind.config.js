module.exports = {
  purge: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: ["Noto Sans HK", "sans-serif"],
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ["active"],
      textColor: ["active"],
    },
  },
  plugins: [],
};
