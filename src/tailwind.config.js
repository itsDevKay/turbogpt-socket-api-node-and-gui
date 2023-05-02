/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/templates/**/*.{html,js}', 
    './app/turbogpt-frontend/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './app/turbogpt-frontend/app/**/*.{js,ts,jsx,tsx,mdx}',
    './app/turbogpt-frontend/components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

