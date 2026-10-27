import type { Config } from 'tailwindcss'

export default {
  theme: {
    extend: {
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          25: '#F3F7FF',
          100: '#E7EEFF',
          200: '#758EC6',
          400: '#1A2D5B',
          500: '#132248',
        },
        accent: {
          100: '#FFE9D6',
          500: '#F97316',
          600: '#EA580C',
        },
        success: { 50: '#ECFDF3', 100: '#D1FADF', 700: '#027A48' },
        warning: { 50: '#FFFAEB', 100: '#FEF0C7', 500: '#F79009', 700: '#B54708' },
        danger: { 50: '#FEF3F2', 100: '#FEE4E2', 500: '#F04438', 700: '#B42318' },
      },
    },
  },
} satisfies Partial<Config>
