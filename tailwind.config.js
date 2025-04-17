/** @type {import('tailwindcss').Config} */
import tailwindcssTextshadow from 'tailwindcss-textshadow';
import tailwindScrollbar from 'tailwind-scrollbar'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        custom_login_signup: '#E3E6F0',
        custom_yellow: 'rgba(241, 187, 69, 1)',
        custom_purple: 'rgba(70, 29, 124, 1)',
        custom_gray: 'rgba(126, 126, 126, 1)',
        custom_darkblue: 'rgba(0, 33, 130, 1)'
      },
      fontFamily: {
        sriracha: ['Sriracha', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
        ruslan_display: ['Ruslan Display', 'sans-serif']
      },
      textShadow: {
        sm: '1px 1px 2px rgba(0, 0, 0, 0.5)',
        lg: '2px 2px 4px rgba(0, 0, 0, 0.5)',
      },
    },
    variants: {
      extend: {
        lineClamp: ['hover']
      },
    }
  },
  plugins: [
    tailwindcssTextshadow,
    tailwindScrollbar,
  ],
}

