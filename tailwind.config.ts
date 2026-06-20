import type { Config } from 'tailwindcss'
import daisyui from 'daisyui'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Noto Sans TC', 'sans-serif'],
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        'midnight-pro': {
          'primary': '#818cf8',
          'secondary': '#fbbf24',
          'accent': '#34d399',
          'neutral': '#1e293b',
          'base-100': '#0f172a',
          'base-200': '#1e293b',
          'base-300': '#334155',
          'base-content': '#f1f5f9',
          'info': '#38bdf8',
          'success': '#4ade80',
          'warning': '#fde047',
          'error': '#f87171',
        },
      },
      {
        'court-day': {
          'primary': '#4338ca',
          'secondary': '#b45309',
          'accent': '#047857',
          'neutral': '#e2e8f0',
          'base-100': '#ffffff',
          'base-200': '#f1f5f9',
          'base-300': '#e2e8f0',
          'base-content': '#0f172a',
          'info': '#0284c7',
          'success': '#15803d',
          'warning': '#b45309',
          'error': '#b91c1c',
        },
      },
    ],
  },
} satisfies Config
