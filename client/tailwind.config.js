/** @type {import('tailwindcss').Config} */
export default {
  content: ["./*.{html,js,ts,jsx}", "./src/**/*.jsx", "*"],
  theme: {
    extend: {
      // Colors used in the project
      colors: {
        primary: "#2885ff",
        secondary: "#ef863e"
      }
    },
  },
  plugins: [],
}

