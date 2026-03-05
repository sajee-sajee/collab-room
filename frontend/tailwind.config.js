/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B0F19', // Deep dark blue background
        surface: {
          DEFAULT: '#111827', // Card/Modal surface
          hover: '#1F2937',
        },
        primary: {
          DEFAULT: '#3B82F6', // Bright blue button
          hover: '#2563EB',
        },
        brand: {
          blue: '#1E40AF',
          purple: '#6D28D9',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-text': 'linear-gradient(to right, #ffffff, #8b5cf6)', // For "Anywhere" text
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
