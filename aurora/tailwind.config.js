/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#2563EB',
          hover: '#3B82F6',
          soft: 'rgba(37, 99, 235, 0.15)',
        },
        'accent-gold': {
          DEFAULT: '#F59E0B',
          hover: '#FBBF24',
          soft: 'rgba(245, 158, 11, 0.15)',
        },
        'accent-cyan': {
          DEFAULT: '#0284C7',
          soft: 'rgba(2, 132, 199, 0.15)',
        },
        status: {
          success: '#10B981',
          warning: '#F59E0B',
          danger: '#EF4444',
        }
      },
      borderRadius: {
        card: '22px',
        pill: '999px',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        serif: ['Fraunces', 'Instrument Serif', 'serif'],
      }
    },
  },
  plugins: [],
}
