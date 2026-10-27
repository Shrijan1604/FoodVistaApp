/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: { extend: { colors: { canvas: '#F7F7F2', ink: '#1F2A24', forest: '#285C43', leaf: '#D6EF76' } } },
  plugins: [],
};
