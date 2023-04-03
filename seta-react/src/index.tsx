import React from 'react'
import { createRoot } from 'react-dom/client'

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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

// Using console.log for development only
// eslint-disable-next-line no-console
const logger = environment.production ? undefined : console.log

reportWebVitals(logger)
