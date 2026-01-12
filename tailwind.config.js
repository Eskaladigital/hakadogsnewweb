/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // Purge agresivo para reducir CSS no utilizado
  safelist: [
    // Solo mantener clases dinámicas críticas
    'animate-fade-in-up',
    'animate-fade-in-scale',
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          dark: '#1a3d23',
          DEFAULT: '#2d5f3a',
        },
        sage: '#6b8e5f',
        gold: '#c9a961',
        terracotta: '#d4735e',
        cream: '#f9f6f1',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
