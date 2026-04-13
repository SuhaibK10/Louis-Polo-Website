import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],

  // Dark mode via class — toggled by next-themes
  darkMode: 'class',

  theme: {
    extend: {
      // ─── Louis Polo Color Palette ─────────────────────────────────────
      colors: {
        // Backgrounds
        'lp-light':  '#FAFAF8', // warm off-white — light mode bg
        'lp-dark':   '#0D0D0B', // near black — dark mode bg

        // Text
        'lp-ink':    '#1A1A1A', // primary text — light mode
        'lp-mist':   '#F0EDE6', // primary text — dark mode

        // Accent — the gold that defines the brand
        'lp-gold':   '#C9A96E',
        'lp-gold-2': '#D4B87E', // gold on hover

        // Muted text
        'lp-muted-light': '#888880',
        'lp-muted-dark':  '#6A6860',

        // Borders
        'lp-border-light': '#E8E8E4',
        'lp-border-dark':  '#1E1E1C',

        // Cards / surfaces
        'lp-surface-light': '#F0EDE6',
        'lp-surface-dark':  '#161614',

        // Status
        'lp-success': '#2D7A4F',
        'lp-error':   '#D94F3D',
      },

      // ─── Typography ───────────────────────────────────────────────────
      fontFamily: {
        // Display / headings — elegant serif
        display: ['var(--font-cormorant)', 'Georgia', 'serif'],
        // Body / UI — clean sans
        sans: ['var(--font-inter)', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },

      // ─── Letter Spacing ───────────────────────────────────────────────
      letterSpacing: {
        'lp-tight':  '-0.025em',
        'lp-normal': '0.01em',
        'lp-wide':   '0.12em',
        'lp-wider':  '0.18em',
        'lp-widest': '0.35em',
      },

      // ─── Transitions ──────────────────────────────────────────────────
      transitionTimingFunction: {
        // The premium ease — used for all LP animations
        'lp': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      },

      transitionDuration: {
        '350': '350ms',
        '400': '400ms',
        '600': '600ms',
      },

      // ─── Animation ────────────────────────────────────────────────────
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        marquee: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        expandWidth: {
          '0%':   { width: '0' },
          '100%': { width: '100%' },
        },
        slideLeft: {
          '0%':   { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },

      animation: {
        'fade-up':     'fadeUp 0.6s cubic-bezier(0.25, 0.1, 0.25, 1) both',
        'fade-in':     'fadeIn 0.5s ease-out both',
        'marquee':     'marquee 22s linear infinite',
        'expand-w':    'expandWidth 0.7s cubic-bezier(0.25, 0.1, 0.25, 1) both',
        'slide-left':  'slideLeft 0.5s cubic-bezier(0.25, 0.1, 0.25, 1) both',
      },

      // ─── Spacing ──────────────────────────────────────────────────────
      // All multiples of 4 — consistent rhythm
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '112': '28rem',
        '128': '32rem',
      },

      // ─── Screen breakpoints ───────────────────────────────────────────
      // Mobile first — 390px base (iPhone 14 standard)
      screens: {
        'xs': '390px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
    },
  },

  plugins: [],
}

export default config
