import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

import { Provider } from 'react-redux';
import { store } from './app/store';

import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/context/AuthContext'; // ✅ Add this

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <AuthProvider> {/* ✅ Wrap your app with AuthProvider */}
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <App />
        </ThemeProvider>
      </AuthProvider>
    </Provider>
  </StrictMode>
);
