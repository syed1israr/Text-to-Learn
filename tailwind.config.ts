import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/**/*.{ts,tsx,js,jsx}",
    "./src/app/**/*.{ts,tsx,js,jsx,css}",
  ],
  theme: {
    extend: {
      colors: {
        interactive: "var(--ds-interactive)",
        "interactive-foreground": "var(--ds-interactive-foreground)",
        bg: "var(--ds-bg)",
        surface: "var(--ds-surface)",
        text: "var(--ds-text)",
        muted: "var(--ds-muted)",
        border: "var(--ds-border)",
        ring: "var(--ds-ring)",
        accent: "var(--ds-accent)",
        danger: "var(--ds-danger)",
        chart1: "var(--ds-chart-1)",
        chart2: "var(--ds-chart-2)",
        chart3: "var(--ds-chart-3)",
        chart4: "var(--ds-chart-4)",
        chart5: "var(--ds-chart-5)",
      },
      borderRadius: {
        sm: "var(--ds-radius-sm)",
        md: "var(--ds-radius-md)",
        lg: "var(--ds-radius-lg)",
        xl: "var(--ds-radius-xl)",
      },
      boxShadow: {
        "ds-1": "var(--ds-shadow-1)",
        "ds-2": "var(--ds-shadow-2)",
        "ds-3": "var(--ds-shadow-3)",
      },
    },
  },
}

export default config
