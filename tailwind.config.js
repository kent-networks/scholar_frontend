/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#135bec',
        'primary-dark': '#0e45b5',
        background: {
          light: '#f6f6f8',
          dark: '#101622',
        },
        surface: {
          light: '#ffffff',
          dark: '#1a202c',
        },
        border: {
          light: '#cfd7e7',
          dark: '#334155',
        },
      },
      fontFamily: {
        display: ['Roboto', 'sans-serif'],
        body: ['Roboto', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
        full: '9999px',
      },
    },
  },
  plugins: [],
}

