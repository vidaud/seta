import React from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'
import App from './App'
import Footer from './components/Footer'
import Header from './components/Header'
import { environment } from './environments/environment'
import reportWebVitals from './reportWebVitals'

const root = createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <React.StrictMode>
    <Header />
    <App />
    <Footer />
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

// Using console.log for development only
// eslint-disable-next-line no-console
const logger = environment.production ? undefined : console.log

reportWebVitals(logger)
