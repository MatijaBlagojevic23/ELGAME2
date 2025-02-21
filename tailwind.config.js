/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}', // Note the addition of `pages` here
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}', // and `app` if you're using the App Router
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}