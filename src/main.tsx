import React from 'react'
import ReactDOM from 'react-dom/client'
import '@fontsource/cormorant-garamond/400.css'
import '@fontsource/cormorant-garamond/500.css'
import '@fontsource/cormorant-garamond/400-italic.css'
import '@fontsource/dm-sans/400.css'
import '@fontsource/dm-sans/500.css'
import '@fontsource/dm-sans/600.css'
import './styles.css'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>)

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const appBase = new URL(import.meta.env.BASE_URL, window.location.origin)
    const workerUrl = new URL('service-worker.js', appBase)
    navigator.serviceWorker.register(workerUrl, { scope: appBase.pathname, updateViaCache: 'none' }).catch((error: unknown) => {
      console.error('Impossible d’activer le mode hors ligne Beaurn.', error)
    })
  })
}
