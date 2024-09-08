/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme'

export default {
  important: true,
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'xs': '475px',
      ...defaultTheme.screens,
    },
    extend: {
      fontFamily: {
        sans: ['Open Sans', 'sans-serif'],
        pacifico: ['Pacifico', 'cursive'],
        nunito: ['Nunito', 'sans-serif']
      },
      colors: {
        "ivory": "#E4E4DE",
        "sage": "#C4C5BA",
        "noir": "#1B1B1B",
        "moss": "#595f39",
      },
    },
  },
  plugins: [],
}

