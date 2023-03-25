import { ErrorBoundary } from '@highlight-run/react'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

export const createCrypto = import("./Api/createCrypto").then((res) => res.default)

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)
