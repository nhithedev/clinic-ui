import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/App.tsx'
import './styles/globals.css'
import { ErrorBoundary } from './app/components/ErrorBoundary'

// Attach global handlers so even fatal async errors get logged to console
// and are visible through the ErrorBoundary.
window.addEventListener('error', (e) => {
  // eslint-disable-next-line no-console
  console.error('Global error:', e.error ?? e.message, e);
});
window.addEventListener('unhandledrejection', (e) => {
  // eslint-disable-next-line no-console
  console.error('Unhandled Promise rejection:', e.reason);
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)
