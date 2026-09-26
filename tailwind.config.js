/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
  saffron: {
    50: '#fff8ef',
    100: '#ffefd9',
    200: '#fbd8ad',
    300: '#f5bc73',
    400: '#eb9840',
    500: '#e57a16',
    600: '#cf6210',
    700: '#b24e0b',
    800: '#8f3e0b',
    900: '#73330b',
    950: '#451b08',
  },

  gold: {
    50: '#fbf8ef',
    100: '#f5edd8',
    200: '#ead9aa',
    300: '#dbc17a',
    400: '#c9a04a',
    500: '#b88932',
    600: '#9f6f28',
    700: '#825620',
    800: '#69451d',
    900: '#54381b',
    950: '#33200e',
  },

  cream: {
    50: '#fff7e8',
    100: '#fff8ed',
    200: '#f9eedb',
    300: '#f1dec0',
    400: '#e7c895',
  },
},
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        serif: ['"Marcellus"', 'Georgia', 'serif'],
        display: ['"Marcellus"', 'Georgia', 'serif'],
      },
      boxShadow: {
        soft: '0 2px 12px -2px rgba(115, 51, 11, 0.08)',

card: '0 6px 24px -8px rgba(115, 51, 11, 0.14)',

glow:
  '0 0 0 1px rgba(201, 160, 74, 0.28), 0 8px 32px -8px rgba(229, 122, 22, 0.22)',
      },
      backgroundImage: {
  'saffron-gradient':
    'linear-gradient(135deg, #e57a16 0%, #cf6210 100%)',

  'gold-gradient':
    'linear-gradient(135deg, #c9a04a 0%, #b88932 100%)',

  'temple-pattern':
    "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c9a04a' fill-opacity='0.06'%3E%3Cpath d='M30 0l30 30-30 30L0 30z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-scale': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'fade-in-scale': 'fade-in-scale 0.4s ease-out forwards',
        'slide-up': 'slide-up 0.6s ease-out forwards',
        shimmer: 'shimmer 2s linear infinite',
        float: 'float 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
