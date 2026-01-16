import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'game-blue': {
          50: '#E8F4F8',
          100: '#D0E8F2',
          200: '#A8D1E5',
          300: '#80BAD8',
          400: '#58A3CB',
          500: '#5DADE2',
          600: '#3498DB',
          700: '#2980B9',
          800: '#21618C',
          900: '#1A5276',
        },
        'game-orange': {
          500: '#FF9500',
          600: '#FF8800',
          700: '#FF7700',
        },
      },
    },
  },
  plugins: [],
}
export default config