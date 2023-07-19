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
import SysAdminLayout from '../../layouts/SysAdminLayout/SysAdminLayout'
import CreateContribution from '../../pages/CommunitiesPage/components/Manage/Contribution/NewContribution/NewContribution'
import InvitesList from '../../pages/CommunitiesPage/components/Sidebar/InvitesList/InvitesList'
import CommunityList from '../../pages/CommunitiesPage/pages/communities/CommunityList/CommunityList'
import { CommunityListProvider } from '../../pages/CommunitiesPage/pages/contexts/community-list.context'
import { ScopeProvider } from '../../pages/CommunitiesPage/pages/contexts/scope-context'
import ResourceList from '../../pages/CommunitiesPage/pages/resources/ResourceList/ResourceList'
import ContactPage from '../../pages/ContactPage'
import FaqsPage from '../../pages/FaqsPage'
import HomePage from '../../pages/HomePage'
import LoginPage from '../../pages/LoginPage'
import NotFoundPage from '../../pages/NotFoundPage'
import ProfilePage from '../../pages/ProfilePage'
import SearchPageNew from '../../pages/SearchPageNew'
import CommunityChangeRequestsPage from '../../pages/SysAdminPage/pages/ChangeRequests/Community/CommunityChangeRequestsPage'
import ResourceChangeRequestsPage from '../../pages/SysAdminPage/pages/ChangeRequests/Resource/ResourceChangeRequestsPage'
import AdminPanelPage from '../../pages/SysAdminPage/pages/Panel/AdminPanelPage'

const ROOT_PATH = '/'
const PANEL_PATH = '/panel/'
const COMMUNITY_PENDING_REQUESTS_PATH = '/communities-requests/'
const RESOURCE_PENDING_REQUESTS_PATH = '/resources-requests/'
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
    <Route path={COMMUNITY_PENDING_REQUESTS_PATH} element={<SysAdminLayout />}>
      <Route
        path=""
        element={
          <RequireAuth>
            <CommunityChangeRequestsPage />
          </RequireAuth>
        }
      />
    </Route>
    <Route path={RESOURCE_PENDING_REQUESTS_PATH} element={<SysAdminLayout />}>
      <Route
        path=""
        element={
          <RequireAuth>
            <ResourceChangeRequestsPage />
          </RequireAuth>
        }
      />
    </Route>
    <Route path={PANEL_PATH} element={<SysAdminLayout />}>
      <Route
        path=""
        element={
          <RequireAuth>
            <AdminPanelPage />
          </RequireAuth>
        }
      />
    </Route>
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
              <ScopeProvider>
                <CommunityList />
              </ScopeProvider>
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
              <ScopeProvider>
                <ResourceList />
              </ScopeProvider>
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
