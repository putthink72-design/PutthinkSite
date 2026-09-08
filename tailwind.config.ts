import type { Config } from "tailwindcss";

/**
 * Design tokens from putthink_site_mockup_v2.html + data_room_mockup.html.
 * Tailwind v4 also mirrors these in globals.css @theme — keep both in sync.
 * Amber: product UI / credit reward context only. Site chrome stays achromatic.
 */
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0A0A0A",
          2: "#141414",
          3: "#1E1E1E",
        },
        bone: {
          DEFAULT: "#F3F1EB",
          2: "#E8E5DC",
        },
        turf: {
          DEFAULT: "#0F3A28",
          2: "#16543A",
        },
        amber: {
          DEFAULT: "#FFB020",
          ink: "#150E02",
          deep: "#C97D0A",
          soft: "#FFF3DE",
          line: "#F5D9A0",
        },
        g: {
          1: "#8A8A85",
          2: "#5A5A56",
        },
        // Data Room tokens
        dr: {
          bg: "#F7F7F4",
          panel: "#FFFFFF",
          "panel-2": "#FBFBF9",
          line: "#E6E6E1",
          "line-soft": "#EFEFEA",
          ink: "#15171A",
          "text-1": "#1E2023",
          "text-2": "#6B706B",
          "text-3": "#9BA09A",
          up: "#2F7D5C",
          "up-soft": "#E6F2EC",
        },
      },
      fontFamily: {
        sans: ["var(--font-pretendard)", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
      },
      maxWidth: {
        site: "1240px",
        "data-room": "1180px",
      },
    },
  },
  plugins: [],
};

export default config;
