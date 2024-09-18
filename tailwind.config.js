/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./public/**/*.{html, js}"
  ],
  theme: {
    extend: {
      boxShadow: {
        'aside-left': '-3px 0px 5px rgba(0,0,0,.3)',
        'shortcut': '3px -3px 5px rgba(0,0,0,.3)',
      }
    }
  },
  plugins: [],
}

