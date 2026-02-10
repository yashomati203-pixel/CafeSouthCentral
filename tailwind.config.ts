import type { Config } from "tailwindcss";

const config: Config = {
	darkMode: ["class"],
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			colors: {
				'coconut-brown': 'var(--color-coconut-brown)',
				'palm-green-dark': 'var(--color-palm-green-dark)',
				'palm-green-light': 'var(--color-palm-green-light)',
				'tropical-yellow': 'var(--color-tropical-yellow)',
				'sand-beige': 'var(--color-sand-beige)',
				'charcoal-black': 'var(--color-charcoal-black)',
				'pure-white': 'var(--color-pure-white)',

				// Semantic Status Colors
				'success': 'var(--success)',
				'success-light': 'var(--success-light)',
				'warning': 'var(--warning)',
				'warning-light': 'var(--warning-light)',
				'error': 'var(--error)',
				'error-light': 'var(--error-light)',
				'info': 'var(--info)',
				'info-light': 'var(--info-light)',

				// New Admin Dashboard Colors (Refined)
				"primary-brown": "var(--color-coconut-brown)",
				"accent-gold": "var(--color-tropical-yellow)",
				"bg-light": "var(--color-sand-beige)",

				background: 'var(--background)',
				foreground: 'var(--foreground)',
				card: {
					DEFAULT: 'var(--color-pure-white)',
					foreground: 'var(--color-gray-700)'
				},
				popover: {
					DEFAULT: 'var(--color-pure-white)',
					foreground: 'var(--color-gray-700)'
				},
				primary: {
					DEFAULT: 'var(--primary)',
					foreground: 'var(--primary-foreground)'
				},
				secondary: {
					DEFAULT: 'var(--secondary)',
					foreground: 'var(--secondary-foreground)'
				},
				muted: {
					DEFAULT: 'var(--color-gray-100)',
					foreground: 'var(--color-gray-500)'
				},
				accent: {
					DEFAULT: 'var(--accent)',
					foreground: 'var(--accent-foreground)'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				},
				'forest': '#102214',
				'forest-light': '#0d4d22',

				// Subscription Page Colors (Updated)
				"primary-green": "#2E8B57",
				"forest-green": "#0d1c11",
				"leaf-green": "#499c5e",
				"background-light": "#F5F9F5",
				"background-dark": "#102214",
				"dark-green": "#1A4D2E",
				"card-btn-green": "#1E4033",
				"alert-bg": "#DFFFD6",
				"alert-border": "#B8E6B0",
				"highlight-yellow": "#FACC15",
			},
			fontFamily: {
				"display": ["Manrope", "sans-serif"],
				"serif-display": ["Californian FB", "serif"],
				"serif": ["var(--font-playfair)", "serif"],
				"sans": ["var(--font-work-sans)", "sans-serif"]
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
};
export default config;
