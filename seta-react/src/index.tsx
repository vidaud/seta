import React from 'react'
import { createRoot } from 'react-dom/client'

import 'primereact/resources/themes/lara-light-blue/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'
import './index.css'

import App from './App'
import { environment } from './environments/environment'
import reportWebVitals from './reportWebVitals'

const container = document.getElementById('root')

if (!container) {
  throw new Error('Root element not found in index.html!')
}

const root = createRoot(container)

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// Using console.log for development only
// Learn more: https://bit.ly/CRA-vitals
// eslint-disable-next-line no-console
const logger = environment.production ? undefined : console.log

reportWebVitals(logger)
