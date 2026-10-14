import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        chalk: "#F7F3EC",
        sand: "#E9DFCF",
        shell: "#F1EADF",
        sea: "#17465A",
        deep: "#0F3343",
        ink: "#13232B",
        terra: "#C66A3D",
        olive: "#7C8463",
        mist: "#5B6B72",
        line: "#DDD3C3",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      transitionTimingFunction: { lux: "cubic-bezier(0.22, 1, 0.36, 1)" },
      boxShadow: { card: "0 20px 50px -24px rgba(19, 35, 43, 0.28)" },
    },
  },
  plugins: [],
};
export default config;
