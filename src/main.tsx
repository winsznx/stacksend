import React from 'react'
import ReactDOM from 'react-dom/client'
import { Buffer } from 'buffer'

// Polyfill Buffer for Stacks.js
globalThis.Buffer = Buffer

import App from './App.tsx'
import { AuthProvider } from './hooks/useAuth.ts'
import './index.css' // Import Tailwind

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
)
