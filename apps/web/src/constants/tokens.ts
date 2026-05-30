// ─────────────────────────────────────────────────────────────
//  DESIGN TOKENS  —  reads from CSS variables in globals.css
//
//  To change ANY color, font, or style:
//  👉 Edit globals.css  — this file never needs to change
//
//  To switch theme at runtime:
//  👉 document.documentElement.setAttribute("data-theme", "blue")
// ─────────────────────────────────────────────────────────────

// ── Colors ────────────────────────────────────────────────────
export const colors = {
  // Backgrounds
  bg: "var(--bg)",
  surface: "var(--surface)",
  surfaceHover: "var(--surface-hover)",
  surfaceInput: "var(--surface-input)",

  // Borders
  border: "var(--border)",
  borderStrong: "var(--border-strong)",
  borderFocus: "var(--border-focus)",
  borderError: "var(--border-error)",
  borderDash: "var(--border-dash)",

  // Text
  text: "var(--text)",
  textSecondary: "var(--text-secondary)",
  textMuted: "var(--text-muted)",
  textFaint: "var(--text-faint)",
  textDisabled: "var(--text-disabled)",

  // Accent
  accent: "var(--accent)",
  accentDark: "var(--accent-dark)",
  accentGlow: "var(--accent-glow)",
  accentBorder: "var(--accent-border)",
  accentText: "var(--accent-text)",
  accentShadow: "var(--accent-shadow)",

  // Semantic
  error: "var(--error)",
  errorBg: "var(--error-bg)",
  errorBorder: "var(--error-border)",
  errorShadow: "var(--error-shadow)",
  success: "var(--success)",
  successBg: "var(--success-bg)",

  // Misc
  divider: "var(--divider)",
} as const;

// ── Typography ────────────────────────────────────────────────
export const typography = {
  fontSans: "var(--font-sans)",
  fontSerif: "var(--font-serif)",
  fontMono: "var(--font-mono)",

  size: {
    xs: "10px",
    sm: "11px",
    base: "13px",
    md: "14px",
    lg: "15px",
    xl: "18px",
    "2xl": "22px",
    "3xl": "26px",
    "4xl": "30px",
  },

  weight: {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
    extrabold: "800",
  },

  tracking: {
    tight: "-0.8px",
    normal: "0px",
    wide: "0.3px",
    wider: "0.5px",
    widest: "1.0px",
    label: "1.5px",
  },
} as const;

// ── Radii ─────────────────────────────────────────────────────
export const radius = {
  sm: "6px",
  md: "8px",
  lg: "10px",
  xl: "12px",
  "2xl": "14px",
  full: "9999px",
} as const;

// ── Shadows ───────────────────────────────────────────────────
export const shadows = {
  none: "none",
  accentSm: "0 4px 20px var(--accent-shadow)",
  accentMd: "0 8px 28px var(--accent-shadow)",
  errorSm: "0 0 0 3px var(--error-shadow)",
  focusSm: "0 0 0 3px var(--accent-focus)",
  card: "0 1px 3px rgba(0,0,0,0.4)",
} as const;

// ── Transitions ───────────────────────────────────────────────
export const transition = {
  fast: "all 0.12s ease",
  base: "all 0.18s ease",
  slow: "all 0.25s ease",
} as const;

// ── Reusable style objects ────────────────────────────────────

export const cardStyle = {
  padding: "20px",
  background: colors.surface,
  border: `1px solid ${colors.border}`,
  borderRadius: radius.xl,
} as const;

export const sectionLabelStyle = {
  margin: 0,
  fontSize: typography.size.sm,
  fontWeight: typography.weight.bold,
  color: colors.textMuted,
  letterSpacing: typography.tracking.widest,
  textTransform: "uppercase" as const,
} as const;

export const bodyTextStyle = {
  margin: 0,
  fontSize: typography.size.base,
  color: colors.textSecondary,
  lineHeight: "1.6",
} as const;

export const hintTextStyle = {
  margin: 0,
  fontSize: typography.size.sm,
  color: colors.textMuted,
  lineHeight: "1.5",
} as const;

export const inputBaseStyle = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: radius.lg,
  color: colors.text,
  fontSize: typography.size.lg,
  outline: "none",
  transition: transition.base,
  boxSizing: "border-box" as const,
  fontFamily: "inherit",
} as const;

export const labelBaseStyle = {
  display: "block",
  fontSize: typography.size.xs,
  fontWeight: typography.weight.semibold,
  letterSpacing: typography.tracking.label,
  textTransform: "uppercase" as const,
  marginBottom: "8px",
  transition: "color 0.2s",
} as const;

export const badgeStyle = {
  fontSize: typography.size.xs,
  padding: "2px 6px",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: radius.sm,
  color: colors.textMuted,
  fontWeight: typography.weight.bold,
  letterSpacing: typography.tracking.wider,
  flexShrink: 0 as const,
} as const;

export const primaryButtonStyle = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "12px 22px",
  background: `linear-gradient(135deg, ${colors.accent}, ${colors.accentDark})`,
  border: "none",
  borderRadius: radius.lg,
  color: "#080808",
  fontSize: typography.size.base,
  fontWeight: typography.weight.extrabold,
  letterSpacing: typography.tracking.wide,
  textTransform: "uppercase" as const,
  cursor: "pointer",
  fontFamily: "inherit",
  boxShadow: shadows.accentSm,
  flexShrink: 0 as const,
  transition: transition.fast,
} as const;

export const ghostButtonStyle = {
  padding: "5px 12px",
  fontSize: typography.size.sm,
  fontWeight: typography.weight.bold,
  letterSpacing: typography.tracking.wide,
  borderRadius: radius.md,
  border: `1px solid ${colors.border}`,
  background: "transparent",
  color: colors.textSecondary,
  cursor: "pointer",
  fontFamily: "inherit",
  transition: transition.fast,
} as const;
