/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      boxShadow: {
        panel: "0 24px 80px rgba(15, 23, 42, 0.10)",
        glow: "0 20px 60px rgba(20, 184, 166, 0.20)"
      }
    }
  },
  plugins: []
};
