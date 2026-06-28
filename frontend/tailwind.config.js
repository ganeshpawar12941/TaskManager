/** @type {import('tailwindcss').Config} */
export default {
  // Paths to all template files so Tailwind can tree-shake unused styles
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],

  darkMode: 'class', // Enable dark mode via class strategy

  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',  // Main primary (Emerald)
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        secondary: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',  // Main secondary (Indigo)
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        surface: {
          light: '#ffffff',
          dark: '#0f172a',
        },
        // Task status colors
        status: {
          todo:        { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' },
          'in-progress': { bg: '#fff7ed', text: '#c2410c', border: '#fed7aa' },
          completed:   { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0' },
        },
        // Task priority colors
        priority: {
          low:    { bg: '#f0fdf4', text: '#16a34a', dot: '#22c55e' },
          medium: { bg: '#fefce8', text: '#ca8a04', dot: '#eab308' },
          high:   { bg: '#fff1f2', text: '#e11d48', dot: '#f43f5e' },
        },
      },

      // ─── Typography ──────────────────────────────────────────────────────
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '1rem' }],
      },

      // ─── Animations ───────────────────────────────────────────────────────
      animation: {
        'fade-in':       'fadeIn 0.3s ease-in-out',
        'fade-out':      'fadeOut 0.3s ease-in-out',
        'slide-up':      'slideUp 0.3s ease-out',
        'slide-down':    'slideDown 0.3s ease-out',
        'scale-in':      'scaleIn 0.2s ease-out',
        'spin-slow':     'spin 3s linear infinite',
        'bounce-once':   'bounceOnce 0.5s ease-out',
        'pulse-slow':    'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer':       'shimmer 1.5s infinite',
      },
      keyframes: {
        fadeIn:    { from: { opacity: '0' }, to: { opacity: '1' } },
        fadeOut:   { from: { opacity: '1' }, to: { opacity: '0' } },
        slideUp:   { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideDown: { from: { opacity: '0', transform: 'translateY(-16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        scaleIn:   { from: { opacity: '0', transform: 'scale(0.95)' }, to: { opacity: '1', transform: 'scale(1)' } },
        bounceOnce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },

      // ─── Shadows ──────────────────────────────────────────────────────────
      boxShadow: {
        'card':    '0 1px 3px 0 rgba(0,0,0,.07), 0 1px 2px -1px rgba(0,0,0,.07)',
        'card-lg': '0 4px 6px -1px rgba(0,0,0,.08), 0 2px 4px -2px rgba(0,0,0,.08)',
        'glow':    '0 0 20px rgba(16,185,129,.35)',
        'inner-lg': 'inset 0 2px 8px rgba(0,0,0,.06)',
      },

      // ─── Border Radius ────────────────────────────────────────────────────
      borderRadius: {
        '4xl': '2rem',
      },

      // ─── Spacing ──────────────────────────────────────────────────────────
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '88': '22rem',
        '112': '28rem',
        '128': '32rem',
      },
    },
  },

  plugins: [],
};
