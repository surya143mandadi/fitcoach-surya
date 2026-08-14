/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0a0a0a',
        panel: '#141416',
        panel2: '#1c1c20',
        line: '#2a2a30',
        brand: '#22d3aa',
        brand2: '#16a37f',
        accent: '#f59e0b',
        danger: '#ef4444',
        muted: '#8a8a95'
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif']
      }
    }
  },
  plugins: []
}
