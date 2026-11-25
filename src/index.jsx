import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './auth/AuthContext';
import AuthGate from './auth/AuthGate';
import ProfileSync from './auth/ProfileSync';
import { openedFromRecoveryLink, supabase } from './lib/supabase';
import DataStores from './storage/DataStores';
import GlobalStyles from './styles/GlobalStyles';
import ErrorBoundary from './lib/ErrorBoundary';
import { LanguageProvider } from './i18n/LanguageContext';
import { registerServiceWorker } from './lib/registerServiceWorker';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <GlobalStyles />
        <ErrorBoundary>
          <AuthProvider client={supabase} initialRecovery={openedFromRecoveryLink}>
            <ProfileSync />
            <AuthGate>
              <DataStores>
                <App />
              </DataStores>
            </AuthGate>
          </AuthProvider>
        </ErrorBoundary>
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>
);

registerServiceWorker();
