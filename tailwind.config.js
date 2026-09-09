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
        brand: {
          purple: {
            DEFAULT: '#6045F4',
            light: '#7E69F7',
            lighter: '#ECE9FE',
            dark: '#482FE0',
            darker: '#361FB8',
          },
          mint: {
            DEFAULT: '#53E6D4',
            light: '#7FEFE1',
            lighter: '#E8FAF8',
            dark: '#2ED4C0',
          },
          carbon: {
            DEFAULT: '#0F1417',
            light: '#1E252B',
            surface: '#151C21',
            border: '#2A333B',
          },
          soft: {
            DEFAULT: '#EBEBED',
            card: '#F6F7FB',
            canvas: '#F8F9FC',
            border: '#E2E4EB',
          },
          neonGreen: {
            DEFAULT: '#39FF14',
            emerald: '#10B981',
            glow: '#4EFA2E',
          }
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Outfit', 'Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        'brand-sm': '0 2px 8px -1px rgba(96, 69, 244, 0.08)',
        'brand-md': '0 8px 24px -4px rgba(96, 69, 244, 0.12)',
        'brand-lg': '0 16px 36px -6px rgba(96, 69, 244, 0.20)',
        'mint-glow': '0 0 25px -3px rgba(83, 230, 212, 0.45)',
        'purple-glow': '0 0 25px -3px rgba(96, 69, 244, 0.45)',
        'glass': '0 8px 32px 0 rgba(15, 20, 23, 0.08)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      }
    },
  },
  plugins: [],
}
