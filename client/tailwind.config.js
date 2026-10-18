/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#ecfeff',
          500: '#22d3ee',
          600: '#0891b2',
        },
        accent: {
          500: '#ec4899',
          600: '#db2777',
        },
      },
      boxShadow: {
        soft: '0 20px 60px rgba(15, 23, 42, 0.18)',
      },
    },
  },
  plugins: [],
};

