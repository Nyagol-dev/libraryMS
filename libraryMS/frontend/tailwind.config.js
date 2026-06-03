/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body: ['"Source Sans 3"', 'system-ui', 'sans-serif'],
        sans: ['"Source Sans 3"', 'system-ui', 'sans-serif'],
      },
      colors: {
        ak: {
          ebony: '#1C0F05',
          'ebony-deep': '#120A02',
          mahogany: '#3D1A08',
          'mahogany-light': '#2E1608',
          'mahogany-dark': '#1A0B02',
          gold: '#C8960C',
          'gold-dim': '#6B4F3A',
          terracotta: '#C4622D',
          parchment: '#F5EDD8',
          forest: '#1A3028',
          'forest-light': '#2A4030',
          ash: '#8C6B4F',
          cream: '#FBF6EC',
          'warm-text': '#C4A882',
          'dark-text': '#4A2E1A',
          'border-subtle': '#1E0C04',
          'section-label': '#3D2010',
        },
        primary: {
          50: '#FBF6EC',
          100: '#F5EDD8',
          200: '#E8D5B0',
          300: '#D4B680',
          400: '#C8960C',
          500: '#C8960C',
          600: '#B0840A',
          700: '#3D1A08',
          800: '#2E1608',
          900: '#1C0F05',
        },
        success: {
          DEFAULT: '#4CAF80',
          dark: '#2A8C5A',
          bg: '#1A3028',
        },
      },
      borderRadius: {
        'ak': '8px',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%': { opacity: '0.5' },
          '50%': { opacity: '1' },
          '100%': { opacity: '0.5' },
        },
      },
    },
  },
  plugins: [],
}