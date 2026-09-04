/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0B0F19',
          card: '#131A2A',
          border: '#1E293B',
          accent: '#10B981',
          cyan: '#06B6D4',
          orange: '#F97316'
        }
      }
    }
  },
  plugins: []
};
