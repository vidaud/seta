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
import CreateContribution from '../../pages/CommunitiesPage/components/Manage/Contribution/NewContribution/NewContribution'
import InvitesList from '../../pages/CommunitiesPage/components/Sidebar/InvitesList/InvitesList'
import CommunityList from '../../pages/CommunitiesPage/pages/communities/CommunityList/CommunityList'
import { CommunityListProvider } from '../../pages/CommunitiesPage/pages/contexts/community-list.context'
import ResourceList from '../../pages/CommunitiesPage/pages/resources/ResourceList/ResourceList'
import ContactPage from '../../pages/ContactPage'
import FaqsPage from '../../pages/FaqsPage'
import HomePage from '../../pages/HomePage'
import LoginPage from '../../pages/LoginPage'
import NotFoundPage from '../../pages/NotFoundPage'
import ProfilePage from '../../pages/ProfilePage'
import SearchPageNew from '../../pages/SearchPageNew'

const ROOT_PATH = '/'
const DISCOVER_COMMUNITY_PATH = '/communities/'
const DISCOVER_RESOURCE_PATH = '/resources/'

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
    <Route path="/invites" element={<CommunityLayout />}>
      <Route
        path=""
        element={
          <RequireAuth>
            <InvitesList />
          </RequireAuth>
        }
      />
    </Route>

    <Route path={DISCOVER_COMMUNITY_PATH} element={<CommunityLayout />}>
      <Route
        path=""
        element={
          <RequireAuth>
            <CommunityListProvider>
              <CommunityList />
            </CommunityListProvider>
          </RequireAuth>
        }
      />
    </Route>
    <Route path={DISCOVER_RESOURCE_PATH} element={<CommunityLayout />}>
      <Route
        path=""
        element={
          <RequireAuth>
            <CommunityListProvider>
              <ResourceList />
            </CommunityListProvider>
          </RequireAuth>
        }
      />
      <Route
        path=":resourceId/contribution/new"
        element={
          <RequireAuth>
            <CreateContribution />
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
