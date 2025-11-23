/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        // Custom colors matching Google Calendar aesthetic
        colors: {
          calendar: {
            blue: '#1a73e8',      // Primary blue
            lightBlue: '#e8f0fe', // Hover states
            gray: '#70757a',      // Secondary text
            border: '#dadce0',    // Border color
            today: '#1a73e8',     // Today highlight
            hover: '#f1f3f4',     // Row hover
          }
        },
        // Custom font family
        fontFamily: {
          sans: ['Google Sans', 'Roboto', 'Arial', 'sans-serif'],
        },
        // Custom grid for time slots
        gridTemplateRows: {
          '24': 'repeat(24, minmax(48px, 1fr))',
          '48': 'repeat(48, minmax(24px, 1fr))', // 30-min slots
        },
        // Minimum height for time slots
        minHeight: {
          'slot': '48px',
        },
        // Animation for event creation
        animation: {
          'fade-in': 'fadeIn 0.2s ease-out',
          'slide-up': 'slideUp 0.2s ease-out',
        },
        keyframes: {
          fadeIn: {
            '0%': { opacity: '0' },
            '100%': { opacity: '1' },
          },
          slideUp: {
            '0%': { opacity: '0', transform: 'translateY(10px)' },
            '100%': { opacity: '1', transform: 'translateY(0)' },
          },
        },
      },
    },
    plugins: [],
  }