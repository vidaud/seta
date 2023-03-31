import './App.css'
import 'primereact/resources/themes/lara-light-blue/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'

import { BrowserRouter, Routes, Route } from 'react-router-dom'

import ProtectedRoute from './components/ProtectedRoute'
import CommunitiesPage from './pages/CommunitiesPage'
import ContactPage from './pages/ContactPage'
import DashboardPage from './pages/DashboardPage'
import FaqsPage from './pages/FaqsPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import NotFoundPage from './pages/NotFoundPage'
import ProfilePage from './pages/ProfilePage'
import SearchPageCopy from './pages/SearchPage'

function App() {
  return (
    <div className="App">
      <link rel="stylesheet" href="https://unpkg.com/primeflex@3.2.1/primeflex.min.css" />
      <BrowserRouter>
        <Routes>
          <Route path="/seta-ui" element={<HomePage />} />
          <Route path="/seta-ui/home" element={<HomePage />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route
            path="/seta-ui/search"
            element={
              <ProtectedRoute>
                <SearchPageCopy />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seta-ui/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seta-ui/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="/seta-ui/communities" element={<CommunitiesPage />} />
          <Route path="/seta-ui/faqs" element={<FaqsPage />} />
          <Route path="/seta-ui/contact" element={<ContactPage />} />
          <Route path="/seta-ui/login" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
