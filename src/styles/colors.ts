/**
 * TypeScript color API — values reference CSS variables from tokens.css (SSOT).
 * @see src/styles/tokens.css
 * @see docs/design/COLOR_TOKEN_SPEC.md
 */

const v = (name: string) => `var(${name})`;

export const COLORS = {
  DARK: v('--color-dark'),
  BUTTON_CHOSEN: v('--color-button-chosen'),
  HOVER: v('--color-hover'),
  LIGHTER: v('--color-lighter'),
  GRAY: v('--color-gray'),
  DARK_GRAY: v('--color-dark'),
  WHITE: v('--color-white'),
  BLACK: v('--color-black'),

  SUCCESS: v('--color-success'),
  ERROR: v('--color-error'),
  WARNING: v('--color-warning'),
  INFO: v('--color-info'),
  DESTRUCTIVE: v('--color-destructive'),
  DESTRUCTIVE_HOVER: v('--color-destructive-hover'),
  WARNING_BG: v('--color-warning-bg'),
  WARNING_TEXT: v('--color-warning-text'),

  TEXT_PRIMARY: v('--color-text-primary'),
  TEXT_SECONDARY: v('--color-text-secondary'),
  TEXT_LIGHT: v('--color-text-light'),

  CHILDREN: v('--color-chart-children'),
  ADULTS: v('--color-chart-adults'),
  ELDERLY: v('--color-chart-elderly'),

  CYAN_ACCENT: v('--color-cyan-accent'),
  BORDER: v('--color-border'),
  INPUT_BACKGROUND: v('--color-input-background'),
};

/** Literal hex for Tailwind arbitrary classes — keep in sync with tokens.css */
export const COLOR_HEX = {
  DARK: '#1F4A51',
  BUTTON_CHOSEN: '#479AA8',
  HOVER: '#F4FDFC',
  WHITE: '#FFFFFF',
  LIGHTER: '#DEF1EF',
  BLACK: '#000000',
  GRAY: '#F5F5F7',
  TEXT_PRIMARY: '#1F4A51',
  TEXT_SECONDARY: '#6B7280',
  BORDER: '#E5E7EB',
  DESTRUCTIVE: '#d4183d',
  DESTRUCTIVE_HOVER: '#b01030',
  WARNING_BG: '#fff4e6',
  WARNING_TEXT: '#f4a261',
} as const;

export const COLOR_CLASSES = {
  DARK: 'bg-[#1F4A51]',
  BUTTON_CHOSEN: 'bg-[#479AA8]',
  HOVER: 'bg-[#F4FDFC]',
  LIGHTER: 'bg-[#DEF1EF]',
  GRAY: 'bg-[#F5F5F7]',
  TEXT_DARK: 'text-[#1F4A51]',
  TEXT_SECONDARY: 'text-[#6B7280]',
  BORDER_LIGHT: 'border-[#E5E7EB]',
};
