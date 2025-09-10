/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/**/*.{html,js}", "./views/**/*.{html,ejs}"],
  theme: {
    extend: {
      backgroundImage: {
        "weather-gradient": "linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)",
        "night-gradient": "linear-gradient(135deg, #2d3436 0%, #636e72 100%)",
      },
      gridTemplateColumns: {
        7: "repeat(7, minmax(0, 1fr))",
        3: "repeat(3, minmax(0, 1fr))",
        4: "repeat(4, minmax(0, 1fr))",
      },
    },
  },
  plugins: [],
};
