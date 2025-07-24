// tailwind.config.js
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#F9EDCD',
          50: '#FCF7E7',
          100: '#FAF1D9',
          200: '#F7E8C2',
          300: '#F3DFAB',
          400: '#F0D694',
          500: '#F9EDCD', // default
          600: '#E3C97B',
          700: '#C9A95E',
          800: '#A08A47',
          900: '#6B5C2E',
        },
        boxwhite: {
          DEFAULT: '#FEFADF',
          50: '#FFFFFF',
          100: '#FEFDF6',
          200: '#FEFBEF',
          300: '#FEF9E8',
          400: '#FEF7E1',
          500: '#FEFADF', // default
          600: '#F7EBC2',
          700: '#E6D8A1',
          800: '#CFC080',
          900: '#B3A45E',
        },
        primary: {
          DEFAULT: '#D2A373',
          50: '#F7EFE7',
          100: '#F0E2D1',
          200: '#E2C7A3',
          300: '#D4AC75',
          400: '#C79047',
          500: '#D2A373', // default
          600: '#A87F4F',
          700: '#7E5B3B',
          800: '#543827',
          900: '#2A1413',
        },
        success: {
          DEFAULT: '#5F6C37',
          50: '#E7EDE0',
          100: '#D1DBBE',
          200: '#A3B77D',
          300: '#75923C',
          400: '#5F6C37', // default
          500: '#4C552C',
          600: '#3A3F21',
          700: '#282916',
          800: '#16130B',
          900: '#0B0905',
        },
        sidebar: {
          DEFAULT: '#273716',
          50: '#E2E7DE',
          100: '#C5CFBD',
          200: '#8CA07B',
          300: '#53713A',
          400: '#273716', // default
          500: '#1F2C12',
          600: '#17210E',
          700: '#0F160A',
          800: '#070B05',
          900: '#030502',
        },
      },
    },
  },
  plugins: [],
}
