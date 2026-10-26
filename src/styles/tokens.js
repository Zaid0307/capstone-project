// Design tokens: the one place for colors, fonts and corner radii.
// The values are the current look; the designer's palette replaces them here.
// GlobalStyles turns them into CSS variables, so a later theme (e.g. dark mode)
// only needs to redefine the variables.
export const tokens = {
  color: {
    text: '#283a45',
    surface: '#d5dee8',
    primary: '#496b73',
    secondary: '#5e888c',
    highlight: '#85c1c7',
    dark: '#344b59',
    hoverText: '#b5dff5',
    error: '#a12a2a',
    white: 'snow',
  },
  font: {
    body: 'sans-serif',
  },
  radius: {
    small: '5px',
    large: '15px',
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
export const radii = cssVariables('radius');

export function cssVariableDeclarations() {
  return Object.entries(tokens)
    .flatMap(([group, values]) =>
      Object.entries(values).map(([name, value]) => `--${group}-${kebab(name)}: ${value};`)
    )
    .join('\n');
}
