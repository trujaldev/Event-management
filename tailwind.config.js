/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      screens: {
        mobile: { raw: "(max-width: 576px)" },
        tablet: { raw: "(min-width: 576px) and (max-width: 768px)" },
        laptop: { raw: "(min-width: 768px) and (max-width: 1200px)" },
        desktop: "1200px",
      },
      colors: {
        'alt-blue-1': '#014778',
        'alt-blue-2': '#3666ae',
        'alt-blue-3': '#0ea5e9',
        'alt-blue-4': '#B9D9EB',
        'alt-white-1': '#e8f1ff',
        'alt-white-2': '#f8f8ff',
      }
    },
  },
  plugins: [],
};
