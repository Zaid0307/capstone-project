import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './auth/AuthContext';
import AuthGate from './auth/AuthGate';
import { supabase } from './lib/supabase';
import DataStores from './storage/DataStores';
import GlobalStyles from './styles/GlobalStyles';
import { LanguageProvider } from './i18n/LanguageContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <GlobalStyles />
        <AuthProvider client={supabase}>
          <AuthGate>
            <DataStores>
              <App />
            </DataStores>
          </AuthGate>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>
);
