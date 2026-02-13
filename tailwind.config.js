/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#FDF2E1",
        sidebar: "#FFF8ED",
        primary: "#8B4513", // marrom
      },
    },
  },
  plugins: [],
};
