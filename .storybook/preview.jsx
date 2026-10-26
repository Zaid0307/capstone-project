import { MemoryRouter } from 'react-router-dom';
import GlobalStyles from '../src/styles/GlobalStyles';
import { LanguageProvider } from '../src/i18n/LanguageContext';

export default {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [
    Story => (
      <MemoryRouter>
        <LanguageProvider>
          <GlobalStyles />
          <Story />
        </LanguageProvider>
      </MemoryRouter>
    ),
  ],
};
