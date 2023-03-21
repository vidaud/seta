import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { ProtectedRoute } from './components/protected-route/protected-route'
import Communities from './pages/communities/communities'
import Contact from './pages/contact/contact'
import Dashboard from './pages/dashboard/dashboard'
import Faqs from './pages/faqs/faqs'
import Home from './pages/home/home'
import Login from './pages/login/login'
import NotFoundPage from './pages/not-found/not-found'
import Profile from './pages/profile/profile'
import Search from './pages/search/search'
import 'primereact/resources/themes/lara-light-blue/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'

function App() {
  return (
    <div className="App">
      {/* <link rel="stylesheet" href="https://unpkg.com/primeicons/primeicons.css" />
      <link rel="stylesheet" href="https://unpkg.com/primereact/resources/themes/lara-light-blue/theme.css" />
      <link rel="stylesheet" href="https://unpkg.com/primereact/resources/primereact.min.css" /> */}
      <link rel="stylesheet" href="https://unpkg.com/primeflex@3.2.1/primeflex.min.css" />
      <BrowserRouter>
        <Routes>
          <Route path="/seta-ui" element={<Home />} />
          <Route path="/seta-ui/home" element={<Home />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route
            path="/seta-ui/search"
            element={
              <ProtectedRoute>
                <Search />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seta-ui/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seta-ui/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/seta-ui/communities" element={<Communities />} />
          <Route path="/seta-ui/faqs" element={<Faqs />} />
          <Route path="/seta-ui/contact" element={<Contact />} />
          <Route path="/seta-ui/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
