// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{html,js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        "primary-100": "#ffc929",
        "primary-200": "#ffb900",
        "secondary-100": "#0b1a78",
        "secondary-200": "#00b050",
      },
    },
  },
  plugins: [],
}
