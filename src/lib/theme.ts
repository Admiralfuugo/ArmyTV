export type Theme = "light" | "dark";
export const THEME_STORAGE_KEY = "armytv-theme";

// Run while parsing the document so a saved preference is applied before paint.
export const themeInitScript = `(() => {
  let saved;
  try { saved = localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)}); } catch {}
  const theme = saved === "light" || saved === "dark"
    ? saved
    : window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  document.documentElement.dataset.theme = theme;
})();`;
