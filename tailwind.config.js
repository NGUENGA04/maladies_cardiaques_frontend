/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1976D2',
          dark: '#0D47A1',
          light: '#E3F0FC',
        },
        secondary: {
          DEFAULT: '#2EC4A6',
          light: '#E3F9F3',
        },
        grisclair: '#F5F7FA',
        grismoyen: '#B0BEC5',
        grisfonce: '#263238',
        risque: {
          faible: '#2EC4A6',
          modere: '#F5A623',
          eleve: '#E53E3E',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 12px 0 rgba(13, 71, 161, 0.08)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
}
