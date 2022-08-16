module.exports = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        pulse: {
          '0%, 100%': {
            opacity: '1'
          },
          '50%': {
            opacity: '.75'
          },
        }
      },
      animation: {
        pulse: 'pulse 2s ease-in-out infinite',
      }
    },
    container: {
      center: true,
    },
  },
  plugins: [],
}
