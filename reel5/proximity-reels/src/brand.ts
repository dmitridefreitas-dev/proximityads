export const BRAND = {
  red: "#E23A2F",
  white: "#FFFFFF",
  offWhite: "#FAFAFA",
  redTint: "#FBE6E4",
  textDark: "#0A0A0A",
  textGray: "#555555",
  black: "#000000",
} as const;

export const light = {
  bg: "#FAFAFA",
  text: BRAND.textDark,
  sub: "#666666",
  card: "#FFFFFF",
  cardBorder: "#E0E0E0",
  fieldBg: "#F0F0F0",
  reviewBg: "#F5F5F5",
  glow: `${BRAND.red}12`,
  glowStrong: `${BRAND.red}20`,
};

export const dark = {
  bg: "#0A0A0A",
  text: "#F0F0F0",
  sub: "#888888",
  card: "#141414",
  cardBorder: "#222222",
  fieldBg: "#1A1A1A",
  reviewBg: "#181818",
  glow: `${BRAND.red}18`,
  glowStrong: `${BRAND.red}30`,
};

export type Theme = typeof dark;

export const getTheme = (isDark: boolean): Theme => (isDark ? dark : light);
