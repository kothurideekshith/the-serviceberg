/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./App.tsx",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./constants.tsx",
  ],
  theme: {
    extend: {
      colors: {
        snow: '#FFFFFF',
        pearl: '#FFFFFF',
        ink: '#0A0A0B',
        lemon: '#FFF77F',
        smoke: '#E5E7EB',
        mint: '#FFFFFF',
        iceBlue: '#FFFFFF',
      },
      fontFamily: {
        sans: ['"Space Grotesk"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
