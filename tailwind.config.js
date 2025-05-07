/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './app/**/*.{js,ts,jsx,tsx,mdx}',
      './pages/**/*.{js,ts,jsx,tsx,mdx}',
      './components/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
      extend: {
        colors: {
          mint: '#7CC4B2',
          mintlight: '#A8E0D2',
          mintdark: '#5A9B8A',
          cream: '#FFF8E1',
          offwhite: '#FAF9F6',
          softpink: '#FADADD',
          darktext: '#3C4043',
        },
      },
    },
    plugins: [],
  };