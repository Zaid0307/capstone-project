import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import GlobalStyles from './styles/GlobalStyles';
import { LanguageProvider } from './i18n/LanguageContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <GlobalStyles />
        <App />
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>
);
