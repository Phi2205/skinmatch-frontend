import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Liora Care design system - Sage green & cream palette
        'sage-dark': '#5a7a6b',
        'sage': '#7a9e8e',
        'sage-light': '#a8bfb5',
        'cream': '#f5f2ed',
        'cream-light': '#faf8f5',
        'accent-gold': '#c9b896',
      },
      fontFamily: {
        'sans': ['var(--font-inter)', 'system-ui', 'sans-serif'],
        'mono': ['var(--font-geist-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
}
export default config
