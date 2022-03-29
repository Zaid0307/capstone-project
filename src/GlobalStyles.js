import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  body {
    
    font-family: sans-serif;
    font-size: 112.5%;
  }
  input, label, button, textarea {
    font-size: 1em;
  }
`;
