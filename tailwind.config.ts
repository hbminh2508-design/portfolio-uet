import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'glass': '0 18px 50px 0 rgba(15, 23, 42, 0.10)',
        'glass-inset': 'inset 0 0 0 1px rgba(15, 23, 42, 0.06)',
      }
    },
  },
  plugins: [],
};
export default config;