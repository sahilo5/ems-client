import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ToastProvider } from './components/ToastProvider.tsx'
import React from 'react'
import { AuthProvider } from "./context/AuthContext";
import { CompanyProvider } from './context/CompanyContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <CompanyProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </CompanyProvider>
    </AuthProvider>
  </StrictMode>,
)
