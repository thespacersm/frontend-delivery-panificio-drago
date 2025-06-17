// tailwind.config.js
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#161513',      // usato per `bg-primary`
          50: '#f5f5f4',
          100: '#e7e5e4',
          200: '#d6d3d1',
          300: '#a8a29e',
          400: '#78716c',
          500: '#57534e',
          600: '#3f3a36',          // usato per `bg-primary-600`
          700: '#292524',
          800: '#1c1917',
          900: '#161513',
        },
      },
    },
  },
  plugins: [],
}
