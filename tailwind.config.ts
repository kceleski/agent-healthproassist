import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				healthcare: {
					50: '#f0f7ff',
					100: '#e0f0ff',
					200: '#c2e1ff',
					300: '#a0c9fe',
					400: '#78acfd',
					500: '#5689f9',
					600: '#3f66ef',
					700: '#3252db',
					800: '#2d43b0',
					900: '#283a8a',
				},
				holo: {
					blue: '#38bdf8',
					purple: '#7c3aed',
					cyan: '#22d3ee',
					pink: '#e879f9',
					glow: 'rgba(56, 189, 248, 0.5)'
				},
				softblue: {
					50: '#F0F7FF',
					100: '#E0F0FF',
					200: '#C2E1FF',
					300: '#A0C9FE',
					400: '#78ACFD',
					500: '#5689F9',
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'fade-in': {
					from: { opacity: '0' },
					to: { opacity: '1' }
				},
				'fade-out': {
					from: { opacity: '1' },
					to: { opacity: '0' }
				},
				'slide-in': {
					from: { transform: 'translateY(10px)', opacity: '0' },
					to: { transform: 'translateY(0)', opacity: '1' }
				},
				'zoom-in': {
					from: { transform: 'scale(0.95)', opacity: '0' },
					to: { transform: 'scale(1)', opacity: '1' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0) translateZ(0)' },
					'50%': { transform: 'translateY(-5px) translateZ(10px)' }
				},
				'holographic-shine': {
					'0%, 100%': { 
						backgroundPosition: '0% 0%',
						opacity: 0.3
					},
					'50%': { 
						backgroundPosition: '100% 100%',
						opacity: 0.5
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.5s ease-out',
				'fade-out': 'fade-out 0.5s ease-out',
				'slide-in': 'slide-in 0.5s ease-out',
				'zoom-in': 'zoom-in 0.3s ease-out',
				'float': 'float 6s ease-in-out infinite',
				'holographic-shine': 'holographic-shine 8s infinite ease-in-out'
			},
			backdropFilter: {
        'none': 'none',
        'blur': 'blur(20px)',
      },
			boxShadow: {
				'soft': '0 4px 12px rgba(0, 0, 0, 0.05)',
				'glass': '0 8px 32px rgba(0, 0, 0, 0.06)',
				'holographic': '0 0 10px rgba(56, 189, 248, 0.3), 0 0 20px rgba(56, 189, 248, 0.1)',
				'holographic-hover': '0 0 15px rgba(56, 189, 248, 0.5), 0 0 30px rgba(56, 189, 248, 0.2)',
				'soft-glow': '0 10px 25px -5px rgba(86, 137, 249, 0.2), 0 5px 15px -5px rgba(86, 137, 249, 0.1)',
				'soft-glow-hover': '0 15px 35px -8px rgba(86, 137, 249, 0.3), 0 8px 20px -8px rgba(86, 137, 249, 0.2)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
