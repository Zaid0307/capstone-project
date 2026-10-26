import GlobalStyles from "../src/styles/GlobalStyles";
import { MemoryRouter } from "react-router-dom";
import { LanguageProvider } from "../src/i18n/LanguageContext";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
export const decorators = [
  (Story) => (
    <>
      <GlobalStyles />
      <Story />
    </>
  ),
  (Story) => (
    <LanguageProvider>
      <Story />
    </LanguageProvider>
  ),
  (Story) => (
    <MemoryRouter>
      <Story />
    </MemoryRouter>
  ),
];
