/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neon-cyan': '#00f3ff',
        'electric-purple': '#7000ff',
        'dark-bg': '#020617',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
