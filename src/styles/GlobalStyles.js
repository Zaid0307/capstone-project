import { createGlobalStyle } from 'styled-components';
import { cssVariableDeclarations, fonts } from './tokens';

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
    font-family: ${fonts.body};
    font-size: 112.5%;
  }
  input, label, button, textarea {
    font-size: 1em;
  }
`;
