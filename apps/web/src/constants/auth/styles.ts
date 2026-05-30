// ─────────────────────────────────────────────────────────────
//  AUTH DESIGN TOKENS
//  All values reference CSS variables defined in globals.css.
//
//  To change any color, spacing, or radius:
//    👉 Edit globals.css — this file never needs to change.
//
//  To switch themes at runtime:
//    👉 document.documentElement.setAttribute("data-theme", "blue")
// ─────────────────────────────────────────────────────────────

export const colors = {
  // Backgrounds
  bg: "var(--bg)",
  surface: "var(--surface)",
  surfaceHover: "var(--surface-hover)",
  surfaceFocus: "var(--accent-focus)",

  // Borders
  border: "var(--border)",
  borderStrong: "var(--border-strong)",
  borderFocus: "var(--border-focus)",
  borderError: "var(--border-error)",

  // Text
  text: "var(--text)",
  textMuted: "var(--text-secondary)",
  textDim: "var(--text-muted)",
  textDimmer: "var(--text-faint)",

  // Accent
  accent: "var(--accent)",
  accentDark: "var(--accent-dark)",
  accentShadow: "var(--accent-shadow)",

  // Semantic
  error: "var(--error)",
  errorBg: "var(--error-bg)",
  errorBorder: "var(--error-border)",
  errorShadow: "var(--error-shadow)",

  // Misc
  divider: "var(--divider)",

  // Loading state — reuses surface tokens
  loadingBg: "var(--surface)",
  loadingBorder: "var(--border-strong)",
  loadingText: "var(--text-muted)",
} as const;

export const INPUT_BASE_STYLE = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: "var(--radius-lg)",
  color: "var(--text)",
  fontSize: "15px",
  outline: "none",
  transition: "all 0.2s",
  boxSizing: "border-box" as const,
  fontFamily: "inherit",
} as const;

export const LABEL_BASE_STYLE = {
  display: "block",
  fontSize: "11px",
  fontWeight: "600",
  letterSpacing: "1.5px",
  textTransform: "uppercase" as const,
  marginBottom: "8px",
  transition: "color 0.2s",
} as const;
