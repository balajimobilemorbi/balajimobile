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
        // ULTRA-PREMIUM LUXURY COLOR SYSTEM
        showroom: {
          bg: '#050505',
          secondary: '#0D1117',
          card: 'rgba(255, 255, 255, 0.05)',
          border: 'rgba(255, 255, 255, 0.08)',
          text: '#F8F8F8',
          subtext: '#B8BDC8',
          accent: '#0FAE72',
          gold: '#D4AF37',
          goldHover: '#E7C76A',
        },
        // Color Aliases for backward compatibility & ultra-luxury mapping
        navy: {
          950: '#050505',
          900: '#0D1117',
          850: '#121820',
          800: '#161E28',
          700: '#1F2B36',
          600: '#0FAE72',
          500: '#0FAE72',
          light: '#F8F8F8',
          glow: 'rgba(15, 174, 114, 0.35)',
          border: 'rgba(255, 255, 255, 0.08)',
        },
        uniform: {
          DEFAULT: '#050505',
          950: '#050505',
          900: '#0D1117',
          800: '#121820',
          700: '#161E28',
        },
        pistel: {
          DEFAULT: '#0D1117',
          900: '#0D1117',
          800: '#121820',
          700: '#1F2B36',
          light: '#B8BDC8',
        },
        gold: {
          DEFAULT: '#D4AF37',
          accent:   '#D4AF37',
          metallic: '#C59B27',
          light:    '#E7C76A',
          shine:    '#E7C76A',
          glow:     'rgba(212, 175, 55, 0.35)',
          border:   'rgba(212, 175, 55, 0.25)',
        },
        emerald: {
          DEFAULT: '#0FAE72',
          accent: '#0FAE72',
          bright: '#10C480',
          900: '#064E3B',
          800: '#047857',
          700: '#099460',
          600: '#0FAE72',
          500: '#10C480',
          glow:   'rgba(15, 174, 114, 0.40)',
          border: 'rgba(15, 174, 114, 0.30)'
        },
        titanium: {
          950: '#050505',
          900: '#0D1117',
          850: '#121820',
          800: '#161E28',
          750: '#1F2B36',
          700: '#2D3C4A',
          600: '#0FAE72',
          500: '#F8F8F8'
        },
      },
      fontFamily: {
        sans:    ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Satoshi', 'General Sans', 'Inter', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-gold':    '0 0 30px rgba(212, 175, 55, 0.35)',
        'glow-emerald': '0 0 30px rgba(15, 174, 114, 0.35)',
        'luxury-card':  '0 20px 40px -15px rgba(0, 0, 0, 0.9), 0 0 1px rgba(255, 255, 255, 0.1)',
        'gold-lift':    '0 20px 50px -10px rgba(212, 175, 55, 0.3), 0 10px 20px rgba(0, 0, 0, 0.8)',
      }
    },
  },
  plugins: [],
}
