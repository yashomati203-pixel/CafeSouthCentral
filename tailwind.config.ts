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
				// New Admin Dashboard Colors
				"primary-brown": "#6f4520",
				"accent-gold": "#D9AC45",
				"bg-light": "#f5f5f4",
				"bg-dark": "#2a2622",
				"surface-light": "#fbfaf9",
				"surface-dark": "#36312d",
				"border-light": "#e3dbd3",
				"border-dark": "#4a443f",
				"text-main": "#191410",
				"text-subtle": "#8c715a",
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
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
				}
			},
			fontFamily: {
				"display": ["Manrope", "sans-serif"],
				"serif-display": ["Californian FB", "serif"]
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
};
export default config;
