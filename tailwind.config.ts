import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#34d399",
          "primary-content": "#1f2937",
          secondary: "#4f46e5",
          "secondary-content": "#dbeafe",
          accent: "#fef08a",
          "accent-content": "#13160f",
          neutral: "#dbeafe",
          "neutral-content": "#1f2937",
          "base-100": "#f3f4f6",
          "base-200": "#d1d5db",
          "base-300": "#d1d5db",
          "base-content": "#1f2937",
          info: "#0369a1",
          "info-content": "#e0f2fe",
          success: "#4ade80",
          "success-content": "#021206",
          warning: "#facc15",
          "warning-content": "#1f2937",
          error: "#b91c1c",
          "error-content": "#fee2e2",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};
export default config;
