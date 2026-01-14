/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'xynexis-dark': '#20242F',
        'xynexis-green': '#67C23A',
        'xynexis-green-hover': '#5aaa32',
        'xynexis-gray': '#2b303b',
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
