import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
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
  darkMode: 'class',
  plugins: [nextui({
    themes: {
      'blue-dark': {
        extend: 'dark',
        colors: {
          background: "#0D001A",
          foreground: "#ffffff",
          overlay: {
            DEFAULT:'rgba(255, 255, 255, 0.5)'
          },
          success: {
            DEFAULT: '#54D1D8'
          },
          warning: {
            DEFAULT: 'DE911D'
          },
          danger: {
            DEFAULT: '#E66A6A'
          },
          divider: {
            DEFAULT: '#9FB3C8',
          },
          primary: {
            50: "#DCEEFB",
            100: "#B6EOFE",
            200: "#84C5F4",
            300: "#62B0E8",
            400: "#4098D7",
            500: "#2680C2",
            600: "#186FAF",
            700: "#0F609B",
            800: "#0A558C",
            900: "#003E6B",
            DEFAULT: "#4098D7",
            foreground: "#ffffff",
          },

        },
      }
    }
  })],
};


export default config;
