/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        'DEFAUlT' : '#054E5A',
        'ac-teal': '#054E5A',
        'ac-teal-hover': '#076781',
        'ac-gold' : '#E1B77E',
      },
      amber: {
        600: '#FFBF00', 
      },
      green: {
        600: '#00FF00', 
      },
      red: {
        600: '#FF0000', 
      },
      gray: {
        600: '#6B7280', 
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

