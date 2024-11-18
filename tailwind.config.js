const { text } = require("stream/consumers");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter_400Regular"],
        "inter-bold": ["Inter_700Bold"],
      },
      colors: {
        // Light mode colors
        background: "#FFFFFF",
        text: {
          default: "#121212",
          dimmed: "#DCDCDC",
        },
        gray: "#EEEEEE",
        purple: {
          default: "#7A51EC",
          secondary: "#EBE5FC",
          tertiary: "#B6A3EB",
        },
        yellow: {
          default: "#F9B801",
          secondary: "#FDE08D",
        },
        green: "#7DC353",
        pink: "#F302C9",
        info: {
          text: "#1E3A8A",
          background: "#DBEAFE",
        },
        failure: {
          background: "#FFE8E6",
          text: "#FB4D3D",
        },
        success: {
          background: "#DCFCE7",
          text: "#14532D",
        },
        status: {
          background: "#FEF9C3",
          text: "#713F12",
        },

        // Dark mode colors
        dark: {
          background: "#121212",
          text: {
            default: "#FFFFFF",
            dimmed: "#353535",
          },
          gray: "#242424",
          purple: {
            default: "#9E9EFF",
            secondary: "#272735",
            tertiary: "#B6A3EB",
          },
          yellow: {
            default: "#FFDE83",
            secondary: "#FDE08D",
          },
          green: "#ABE28B",
          pink: "#F4AFE8",
          info: {
            text: "#1E3A8A",
            background: "#DBEAFE",
          },
          alert: {
            background: "#7F1D1D",
            text: "#FF8F85",
          },
          success: {
            background: "#14532D",
            text: "#DCFCE7",
          },
          status: {
            background: "#713F12",
            text: "#FEF9C3",
          },
        },
      },
    },
  },
  plugins: [],
};
