import { createGlobalStyle } from 'styled-components';
import {
  colors,
  cssVariableDeclarations,
  fonts,
  fontSizes,
  fontWeights,
  lineHeights,
} from './tokens';

export default createGlobalStyle`
  :root {
    ${cssVariableDeclarations()}
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  body {
    background-color: ${colors.background};
    color: ${colors.text};
    font-family: ${fonts.body};
    font-size: ${fontSizes.body};
    line-height: ${lineHeights.body};
  }
  input, label, button, textarea, select {
    font: inherit;
    color: inherit;
  }
  h1, h2, h3, h4, h5 {
    font-weight: ${fontWeights.bold};
    line-height: ${lineHeights.heading};
    overflow-wrap: anywhere;
  }
  p, dd, dt, li {
    overflow-wrap: anywhere;
  }
  button:not(:disabled), select:not(:disabled), a {
    cursor: pointer;
  }

  /* Focus ring: 3px, 3px away from the element. The white ring fills the gap,
     so the focus stays visible on dark surfaces too. */
  :focus-visible {
    outline: 3px solid ${colors.focus};
    outline-offset: 3px;
    box-shadow: 0 0 0 3px ${colors.white};
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      transition: none !important;
      animation: none !important;
      scroll-behavior: auto !important;
    }
  }
`;
