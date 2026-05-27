import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router'

import 'antd/dist/reset.css'
import './index.css'

import { router } from './app/router'
import AppProviders from './app/AppProviders'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <AppProviders>
    <RouterProvider router={router} />
  </AppProviders>
)
