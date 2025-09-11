// modes.ts
export const allModes = {
  "light desktop": {
    backgrounds: "light",
    viewport: "large",
    globals: { theme: "light" },
  },
  "light mobile": {
    backgrounds: "light",
    viewport: { width: 320, height: 568 },
    globals: { theme: "light" },
  },
  "dark desktop": {
    backgrounds: "dark",
    viewport: "large",
    globals: { theme: "dark" },
  },
  "dark mobile": {
    backgrounds: "dark",
    viewport: { width: 320, height: 568 },
    globals: { theme: "dark" },
  },
};
