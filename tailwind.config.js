/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'primary-white': '#FFFFFF',
        'off-white': '#F9F9F9',
        'accent-red': '#E60000',
        'accent-red-dark': '#CC0000',
        'text-primary': '#000000',
        'text-secondary': '#222222',
        'text-light': '#666666',
        'border-light': '#E5E5E5',
        'nav-active': '#EBEBEB',
      },
      fontFamily: {
        primary: ['League Spartan', 'sans-serif'],
      },
      fontSize: {
        'hero': ['60px', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        'h1': ['48px', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        'h2': ['32px', { lineHeight: '1.2' }],
        'h3': ['24px', { lineHeight: '1.2' }],
        'body': ['18px', { lineHeight: '1.6' }],
        'small': ['16px', { lineHeight: '1.5' }],
      },
      boxShadow: {
        'sm': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'md': '0 4px 16px rgba(0, 0, 0, 0.12)',
        'lg': '0 8px 24px rgba(0, 0, 0, 0.16)',
        'red': '0 4px 12px rgba(230, 0, 0, 0.3)',
      },
      borderRadius: {
        'full': '50px',
      },
    },
  },
  plugins: [],
};
