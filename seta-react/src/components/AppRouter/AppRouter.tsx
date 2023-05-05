import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider
} from 'react-router-dom'

import RequireAuth from './components/RequireAuth'

import AppLayout from '../../layouts/AppLayout'
import CommunityLayout from '../../layouts/CommunityLayout/CommunityLayout'
import DashboardsPage from '../../pages/CommunitiesPage/pages/DashboardPage'
import CommunityListPage from '../../pages/CommunitiesPage/pages/Discovery/CommunityList/CommunityList'
import MyCommunityListPage from '../../pages/CommunitiesPage/pages/Manage/MyCommunityList/MyCommunityList'
import ContactPage from '../../pages/ContactPage'
import FaqsPage from '../../pages/FaqsPage'
import HomePage from '../../pages/HomePage'
import LoginPage from '../../pages/LoginPage'
import NotFoundPage from '../../pages/NotFoundPage'
import ProfilePage from '../../pages/ProfilePage'
import SearchPage from '../../pages/SearchPage'
import SearchPageNew from '../../pages/SearchPageNew/SearchPageNew'

const ROOT_PATH = '/'
const COMMUNITY_PATH = '/communities'

const routes = createRoutesFromElements(
  <Route path={ROOT_PATH} element={<AppLayout />}>
    <Route index element={<HomePage />} />
    <Route path="home" element={<Navigate to={ROOT_PATH} />} />

    <Route
      path="search-new"
      element={
        <RequireAuth>
          <SearchPageNew />
        </RequireAuth>
      }
    />

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
    {/* <Route
      path="dashboard"
      element={
        <RequireAuth>
          <CommunitiesPage />
        </RequireAuth>
      }
    /> */}
    <Route path="faqs" element={<FaqsPage />} />
    <Route path="contact" element={<ContactPage />} />
    <Route path="login" element={<LoginPage />} />
    <Route path={COMMUNITY_PATH} element={<CommunityLayout />}>
      <Route
        path="dashboard"
        element={
          <RequireAuth>
            <DashboardsPage />
          </RequireAuth>
        }
      />
      <Route
        path="list"
        element={
          <RequireAuth>
            <CommunityListPage />
          </RequireAuth>
        }
      />
      <Route
        path="my-list"
        element={
          <RequireAuth>
            <MyCommunityListPage />
          </RequireAuth>
        }
      />
    </Route>
    <Route path="*" element={<NotFoundPage />} />
  </Route>
)

const AppRouter = () => {
  const router = createBrowserRouter(routes)

  return <RouterProvider router={router} />
}

export default AppRouter
