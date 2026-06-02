import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router'

import 'antd/dist/reset.css'
import './index.css'

import { router } from './app/router'
import AppProviders from './app/AppProviders'
import { registerChunkRecovery } from './lib/chunk-recovery'

registerChunkRecovery()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <AppProviders>
    <RouterProvider router={router} />
  </AppProviders>
)

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
  })
}
