import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider
} from 'react-router-dom'

import RequireAuth from './components/RequireAuth'

import AppLayout from '../../layouts/AppLayout'
import CommunitiesPage from '../../pages/CommunitiesPage'
import ContactPage from '../../pages/ContactPage'
import DashboardPage from '../../pages/DashboardPage'
import FaqsPage from '../../pages/FaqsPage'
import HomePage from '../../pages/HomePage'
import LoginPage from '../../pages/LoginPage'
import NotFoundPage from '../../pages/NotFoundPage'
import ProfilePage from '../../pages/ProfilePage'
import SearchPage from '../../pages/SearchPage'

const ROOT_PATH = '/'

const routes = createRoutesFromElements(
  <Route path={ROOT_PATH} element={<AppLayout />}>
    <Route index element={<HomePage />} />
    <Route path="home" element={<Navigate to={ROOT_PATH} />} />

    <Route
      path="search"
      element={
        <RequireAuth>
          <SearchPage />
        </RequireAuth>
      }
    />
    <Route
      path="profile"
      element={
        <RequireAuth>
          <ProfilePage />
        </RequireAuth>
      }
    />
    <Route
      path="dashboard"
      element={
        <RequireAuth>
          <DashboardPage />
        </RequireAuth>
      }
    />

    <Route path="communities" element={<CommunitiesPage />} />
    <Route path="faqs" element={<FaqsPage />} />
    <Route path="contact" element={<ContactPage />} />
    <Route path="login" element={<LoginPage />} />

    <Route path="*" element={<NotFoundPage />} />
  </Route>
)

const AppRouter = () => {
  const router = createBrowserRouter(routes)

  return <RouterProvider router={router} />
}

export default AppRouter
