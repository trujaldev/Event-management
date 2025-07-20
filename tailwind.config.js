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
    },
  },
  plugins: [],
};
