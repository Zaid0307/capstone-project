// Design tokens: the one place for colors, fonts, sizes and spacing.
// Values from the design handoff (design-handoff/from-design/design-tokens-v1.json).
// GlobalStyles turns them into CSS variables, so a later theme (e.g. dark mode)
// only needs to redefine the variables.
export const tokens = {
  color: {
    text: '#172B36',
    textMuted: '#465E6B',
    background: '#F4F7F8',
    surface: '#FFFFFF',
    surfaceMuted: '#E8EFF2',
    border: '#647C89',
    primary: '#075D69',
    primaryHover: '#064C56',
    primaryActive: '#043B43',
    onPrimary: '#FFFFFF',
    secondary: '#E8EFF2',
    highlight: '#D5EEF1',
    dark: '#172B36',
    // Only for text on dark surfaces.
    hoverText: '#FFFFFF',
    error: '#A32132',
    errorSurface: '#FFF0F2',
    focus: '#164BC5',
    disabledText: '#465E6B',
    disabledSurface: '#E0E7EB',
    muscleHighlight: '#F5A623',
    muscleOutline: '#172B36',
    white: '#FFFFFF',
  },
  font: {
    body: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  fontSize: {
    caption: '0.875rem',
    body: '1rem',
    lead: '1.125rem',
    section: '1.25rem',
    title: '1.75rem',
    hero: '2.25rem',
  },
  lineHeight: {
    body: '1.5',
    heading: '1.2',
  },
  fontWeight: {
    regular: '400',
    medium: '600',
    bold: '700',
  },
  space: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    xxl: '32px',
    section: '48px',
  },
  radius: {
    small: '8px',
    large: '16px',
    pill: '999px',
  },
  shadow: {
    card: '0 2px 8px rgb(23 43 54 / 8%)',
    navigation: '0 -2px 12px rgb(23 43 54 / 10%)',
  },
  size: {
    touchTarget: '44px',
    inputHeight: '48px',
    navigationHeight: '72px',
    contentMax: '720px',
  },
  motion: {
    fast: '120ms',
    normal: '180ms',
  },
};

const kebab = name => name.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);

// Maps a token group to CSS variable references, e.g. colors.text -> 'var(--color-text)'.
function cssVariables(group) {
  return Object.fromEntries(
    Object.keys(tokens[group]).map(name => [name, `var(--${group}-${kebab(name)})`])
  );
}

export const colors = cssVariables('color');
export const fonts = cssVariables('font');
export const fontSizes = cssVariables('fontSize');
export const lineHeights = cssVariables('lineHeight');
export const fontWeights = cssVariables('fontWeight');
export const space = cssVariables('space');
export const radii = cssVariables('radius');
export const shadows = cssVariables('shadow');
export const sizes = cssVariables('size');
export const motion = cssVariables('motion');

// Height of the bottom navigation including the safe area of phones with a home bar.
export const navigationOffset = `calc(${sizes.navigationHeight} + env(safe-area-inset-bottom, 0px))`;

export function cssVariableDeclarations() {
  return Object.entries(tokens)
    .flatMap(([group, values]) =>
      Object.entries(values).map(([name, value]) => `--${group}-${kebab(name)}: ${value};`)
    )
    .join('\n');
}
