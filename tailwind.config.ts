import type { Config } from "tailwindcss";

const config: Config = {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				background: '#FFFFFF', // Change to your desired background color
				foreground: '#000000', // Change to your desired foreground color
				card: {
					DEFAULT: '#F7F7F7', // Card background color
					foreground: '#1A1A1A', // Card text color
				},
				popover: {
					DEFAULT: '#F4F4F4', // Popover background color
					foreground: '#333333', // Popover text color
				},
				primary: {
					DEFAULT: '#3B82F6', // Primary color
					foreground: '#FFFFFF', // Primary text color
				},
				secondary: {
					DEFAULT: '#D1D5DB', // Secondary color
					foreground: '#1F2937', // Secondary text color
				},
				muted: {
					DEFAULT: '#E5E7EB', // Muted color
					foreground: '#1F2937', // Muted text color
				},
				accent: {
					DEFAULT: '#FFFFFF', // Accent color
					foreground: '#1F2937', // Accent text color
				},
				destructive: {
					DEFAULT: '#EF4444', // Destructive color
					foreground: '#FFFFFF', // Destructive text color
				},
				border: '#D1D5DB', // Border color
				input: '#F3F4F6', // Input color
				ring: '#A1A1AA', // Ring color
				chart: {
					'1': '#2563EB', // Chart color 1
					'2': '#4F46E5', // Chart color 2
					'3': '#9333EA', // Chart color 3
					'4': '#FFFFFF', // Chart color 1
					'5': '#FFFFFF', // Chart color 2
				},
			},
			borderRadius: {
				lg: '0.5rem', // Large border radius
				md: '0.375rem', // Medium border radius
				sm: '0.25rem', // Small border radius
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
};

export default config;
