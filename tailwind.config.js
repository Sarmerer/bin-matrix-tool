module.exports = {
  purge: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    maxWidth: {
      "1/4": "25%",
      "1/2": "50%",
      "3/4": "75%",
      "1/5": "20%",
      "3/10": "30%",
    },
    flex: {
      2: "1 1 20%",
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
