/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Cake-frosting pink — Cake Hamper Sisters ka main brand color
        primary: {
          50: '#fff3f6',
          100: '#ffe4eb',
          200: '#ffc6d6',
          300: '#ff9ab5',
          400: '#fa6690',
          500: '#ef3d70',
          600: '#d92a5c',
          700: '#b71e4a',
          800: '#941c40',
          900: '#7a1a39',
        },
        // Bakery gold — cream/vanilla frosting accent
        gold: {
          400: '#f4c542',
          500: '#e8b020',
          600: '#c8920e',
        },
        // Chocolate / cream neutrals
        warm: {
          50: '#fdf8f4',
          100: '#f8ede4',
          200: '#eeddce',
          900: '#3a2418',
        }
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
        hindi: ['"Hind"', 'sans-serif'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      }
    },
  },
  plugins: [],
}
