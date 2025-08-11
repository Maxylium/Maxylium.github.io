/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./assets/*.js"],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
      animation: {
        'gradient': 'gradientAnimation 15s ease infinite',
        'blob': 'blobFloat 20s infinite alternate',
        'blob-reverse': 'blobFloat 25s infinite alternate-reverse',
      },
      keyframes: {
        gradientAnimation: {
          '0%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
          '100%': { 'background-position': '0% 50%' },
        },
        blobFloat: {
          'to': {
            transform: 'translate(20px, -30px) scale(1.1)',
            'border-radius': '70% 30% 40% 60% / 60% 40% 70% 30%',
          },
        },
      },
    },
  },
  plugins: [],
}