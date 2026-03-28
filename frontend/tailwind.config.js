/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}"
    ],
    darkMode: 'class',  // ✅ class-based dark mode toggle
    theme: {
        extend: {
            colors: {
                primary: '#00F020',
                'primary-dark': '#00c41a',
                'dark-bg': '#020b06',
                'dark-surface': 'rgba(255,255,255,0.05)',
                'dark-border': 'rgba(0,240,32,0.15)',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            backdropBlur: {
                xs: '2px',
            },
            animation: {
                'fade-up': 'fadeUp 0.5s ease-out',
                'counter': 'counter 2s ease-out',
                'pulse-green': 'pulseGreen 2s infinite',
            },
            keyframes: {
                fadeUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                pulseGreen: {
                    '0%, 100%': { boxShadow: '0 0 0 0 rgba(0, 240, 32, 0.4)' },
                    '50%': { boxShadow: '0 0 0 10px rgba(0, 240, 32, 0)' },
                }
            }
        },
    },
    plugins: [],
};