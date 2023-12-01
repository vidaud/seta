import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider
} from 'react-router-dom'

import ContactPage from '~/pages/ContactPage'
import DatasourcesPage from '~/pages/DatasourcesPage/DatasourcesPage'
import FaqsPage from '~/pages/FaqsPage'
import HomePage from '~/pages/HomePage'
import LoginPage from '~/pages/LoginPage'
import NotFoundPage from '~/pages/NotFoundPage'
import SearchPageNew from '~/pages/SearchPageNew'

import AppLayout from '~/layouts/AppLayout'

import LoginAuth from './components/LoginAuth'
import RequireAuth from './components/RequireAuth'
import AdminRoutes from './routes/AdminRoutes'
import UserRoutes from './routes/UserRoutes'

const ROOT_PATH = '/'
const routes = createRoutesFromElements(
  <Route path={ROOT_PATH} element={<AppLayout />}>
    <Route index element={<HomePage />} />
    <Route path="home" element={<Navigate to={ROOT_PATH} />} />

    <Route
      path="search"
      element={
        <RequireAuth>
          <SearchPageNew />
        </RequireAuth>
      }
    />

    <Route
      path="datasources"
      element={
        <RequireAuth>
          <DatasourcesPage />
        </RequireAuth>
      }
    />

    <Route path="faqs" element={<FaqsPage />} />
    <Route path="contact" element={<ContactPage />} />
    <Route
      path="login"
      element={
        <LoginAuth>
          <LoginPage />
        </LoginAuth>
      }
    />

    <Route path="admin" children={AdminRoutes} />
    <Route path="profile" children={UserRoutes} />
    <Route path="*" element={<NotFoundPage />} />
  </Route>
)

const AppRouter = () => {
  const router = createBrowserRouter(routes)

  return <RouterProvider router={router} />
}

export default AppRouter
