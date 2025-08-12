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
				// Algorithm Visualizer Colors
				algo: {
					blue: 'hsl(var(--algo-blue))',
					purple: 'hsl(var(--algo-purple))',
					cyan: 'hsl(var(--algo-cyan))',
					green: 'hsl(var(--algo-green))',
					orange: 'hsl(var(--algo-orange))',
					red: 'hsl(var(--algo-red))'
				},
				bar: {
					default: 'hsl(var(--bar-default))',
					comparing: 'hsl(var(--bar-comparing))',
					swapping: 'hsl(var(--bar-swapping))',
					sorted: 'hsl(var(--bar-sorted))',
					pivot: 'hsl(var(--bar-pivot))'
				}
			},
			backgroundImage: {
				'gradient-primary': 'var(--gradient-primary)',
				'gradient-bar': 'var(--gradient-bar)',
				'gradient-glass': 'var(--gradient-glass)'
			},
			boxShadow: {
				'glow': 'var(--shadow-glow)',
				'bar': 'var(--shadow-bar)',
				'glass': 'var(--shadow-glass)'
			},
			animation: {
				'bar-grow': 'bar-grow 0.5s ease-out',
				'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
				'slide-up': 'slide-up 0.3s ease-out',
				'fade-in': 'fade-in 0.5s ease-out',
				'gradient-flow': 'gradient-flow 3s ease-in-out infinite',
				'shake': 'shake 0.6s ease-in-out',
				'celebrate': 'celebrate 0.8s ease-out',
				'pivot-glow': 'pivot-glow 2s ease-in-out infinite',
				'float': 'float 3s ease-in-out infinite',
				'entrance': 'entrance 0.6s ease-out'
			},
			keyframes: {
				'bar-grow': {
					'0%': { transform: 'scaleY(0)', opacity: '0' },
					'100%': { transform: 'scaleY(1)', opacity: '1' }
				},
				'pulse-glow': {
					'0%, 100%': { boxShadow: '0 0 15px hsl(var(--bar-comparing) / 0.4)' },
					'50%': { boxShadow: '0 0 30px hsl(var(--bar-comparing) / 0.8)' }
				},
				'slide-up': {
					'0%': { transform: 'translateY(20px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				'fade-in': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				'gradient-flow': {
					'0%, 100%': { backgroundPosition: '0% 50%' },
					'50%': { backgroundPosition: '100% 50%' }
				},
				'shake': {
					'0%, 100%': { transform: 'scale(1.1) translateY(-4px) translateX(0)' },
					'25%': { transform: 'scale(1.1) translateY(-4px) translateX(-2px)' },
					'75%': { transform: 'scale(1.1) translateY(-4px) translateX(2px)' }
				},
				'celebrate': {
					'0%': { transform: 'scale(1)' },
					'50%': { transform: 'scale(1.05) translateY(-2px)' },
					'100%': { transform: 'scale(1)' }
				},
				'pivot-glow': {
					'0%, 100%': { 
						boxShadow: '0 0 20px hsl(var(--bar-pivot) / 0.6)',
						transform: 'scale(1.08) translateY(-3px)'
					},
					'50%': { 
						boxShadow: '0 0 40px hsl(var(--bar-pivot) / 0.9)',
						transform: 'scale(1.12) translateY(-5px)'
					}
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'entrance': {
					'0%': { 
						transform: 'translateY(30px) scale(0.9)', 
						opacity: '0' 
					},
					'50%': { 
						transform: 'translateY(-5px) scale(1.02)', 
						opacity: '0.8' 
					},
					'100%': { 
						transform: 'translateY(0) scale(1)', 
						opacity: '1' 
					}
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
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
