import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "var(--paper)",
        sheet: "var(--sheet)",
        ink: "var(--ink)",
        muted: "var(--muted)",
        rule: "var(--rule)",
        teal: "var(--teal)",
        "teal-deep": "var(--teal-deep)",
        amber: "var(--amber)",
      },
      fontFamily: { sans: ["'Archivo Variable'", "system-ui", "sans-serif"] },
      maxWidth: { prose: "68ch" },
    },
  },
  plugins: [],
} satisfies Config;
