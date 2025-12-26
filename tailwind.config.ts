import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                'coconut-brown': 'var(--color-coconut-brown)',
                'palm-green-dark': 'var(--color-palm-green-dark)',
                'palm-green-light': 'var(--color-palm-green-light)',
                'tropical-yellow': 'var(--color-tropical-yellow)',
                'sand-beige': 'var(--color-sand-beige)',
                'charcoal-black': 'var(--color-charcoal-black)',
            },
        },
    },
    plugins: [],
};
export default config;
