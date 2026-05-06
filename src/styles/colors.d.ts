declare module '@/styles/colors' {
  export const COLORS: {
    DARK: string;
    BUTTON_CHOSEN: string;
    HOVER: string;
    LIGHTER: string;
    GRAY: string;
    DARK_GRAY: string;
    WHITE: string;
    BLACK: string;
    SUCCESS: string;
    ERROR: string;
    WARNING: string;
    INFO: string;
    TEXT_PRIMARY: string;
    TEXT_SECONDARY: string;
    TEXT_LIGHT: string;
    CHILDREN: string;
    ADULTS: string;
    ELDERLY: string;
    CYAN_ACCENT: string;
  };
  export const COLOR_CLASSES: Record<string, string>;
  export type Colors = typeof COLORS;
  const _default: typeof COLORS;
  export default _default;
}
