/** @type {import('tailwindcss').Config} */
export default {
  content: ['./public/**/*.html', './src/**/*.vue'],
  safelist: [
    {
      pattern: /col-(start|end)-(.)*/,
    },
  ],
  darkMode: 'selector', // or 'media' or 'class'
  theme: {
    extend: {
    },
  },
  plugins: [],
}