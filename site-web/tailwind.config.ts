import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './app/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                // кастомные шрифты для Tailwind utility
                comicNeue: ['"Comic Neue"', 'sans-serif'],
                montserrat: ['"Montserrat"', 'sans-serif']
            },
        },
    },
    plugins: [],
}

export default config
