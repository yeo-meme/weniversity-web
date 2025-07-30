/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        pretendard: ["Pretendard", "sans-serif"],
      },
      colors: {
        primary: "#2E6FF2",
        "main-text": "#121314",
        activation: "#DEE8FF",
        gray100: "#F3F5FA",
        gray200: "#D9DBE0",
        gray500: "#8D9299",
        gray700: "#47494D",
      },
    },
  },
  plugins: [],
  theme: {
    extend: {
      fontFamily: {
        pretendard: ["Pretendard", "sans-serif"],
      },
    },
  },
  plugins: [],
};
