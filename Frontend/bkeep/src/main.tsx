import React from 'react'
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import {QueryClient, QueryClientProvider} from 'react-query';

import App from './App.tsx'

const queryClient = new QueryClient();
const{VITE_GOOGLE_CLIENT_ID}= import.meta.env;
ReactDOM.createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId={VITE_GOOGLE_CLIENT_ID}>
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
</GoogleOAuthProvider>
);
