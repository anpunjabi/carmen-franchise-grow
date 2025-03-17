
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
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				carmen: {
					'navy': '#002D4F',  // Dark navy blue from logo
					'blue': '#0A4273',  // Medium blue from logo/shirt
					'light-blue': '#3A6898', // Lighter blue from logo/shirt
					'teal': '#4A8B9E',  // Teal from shirt
					'soft-teal': '#6EACBA', // Softer teal from shirt
					'lavender': '#B4B6E7', // Light lavender accent
					'sky': '#9DCBEB',   // Sky blue accent
					'sand': '#F5F0E6',  // Warm sand background
					'cream': '#FFF9F0', // Cream background
					'gray': '#F7F9FA'   // Light gray background
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				'fade-in-up': {
					'0%': { opacity: '0', transform: 'translateY(20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'slide-in-right': {
					'0%': { transform: 'translateX(100%)', opacity: '0' },
					'100%': { transform: 'translateX(0)', opacity: '1' }
				},
				'floating': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.6s ease-out forwards',
				'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
				'slide-in-right': 'slide-in-right 0.6s ease-out forwards',
				'floating': 'floating 3s ease-in-out infinite'
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'carmen-gradient': 'linear-gradient(to right, #0A4273, #4A8B9E)',
				'carmen-gradient-light': 'linear-gradient(to right, #3A6898, #6EACBA)',
				'carmen-gradient-dark': 'linear-gradient(to right, #002D4F, #0A4273)',
				'carmen-gradient-soft': 'linear-gradient(to right, #6EACBA, #9DCBEB)',
				'pattern-dots': "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1H1.5M5.5 1H6M10 1H10.5M14.5 1H15M19 1H19.5M1 5.5H1.5M5.5 5.5H6M10 5.5H10.5M14.5 5.5H15M19 5.5H19.5M1 10H1.5M5.5 10H6M10 10H10.5M14.5 10H15M19 10H19.5M1 14.5H1.5M5.5 14.5H6M10 14.5H10.5M14.5 14.5H15M19 14.5H19.5M1 19H1.5M5.5 19H6M10 19H10.5M14.5 19H15M19 19H19.5' stroke='rgba(10, 66, 115, 0.1)' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")"
			},
			boxShadow: {
				'glass': '0 4px 30px rgba(0, 0, 0, 0.1)',
				'glass-lg': '0 8px 32px rgba(0, 0, 0, 0.1)',
				'glass-xl': '0 16px 40px rgba(0, 0, 0, 0.15)',
				'soft': '0 8px 30px rgba(74, 139, 158, 0.15)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
