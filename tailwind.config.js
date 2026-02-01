/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                primary: "#FFD700", // Gold
                secondary: "#B8860B", // Dark Gold
                accent: "#FFFFFF", // White Accents
                background: "#050505", // Deep Black
                surface: "#121212", // Premium Surface
                muted: "#8B92A0",
                border: "#1E1E2E",
            },
            fontFamily: {
                sans: ["Outfit", "sans-serif"],
                mono: ["JetBrainsMono", "monospace"],
            },
        },
    },
    plugins: [],
};
