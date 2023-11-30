import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider
} from 'react-router-dom'

import CommunitiesPage from '~/pages/CommunitiesPage/CommunitiesPage'
import CreateContribution from '~/pages/CommunitiesPage/components/contributors/NewContribution/NewContribution'
import InvitesList from '~/pages/CommunitiesPage/components/notifications/invitesList'
import MembersList from '~/pages/CommunitiesPage/components/notifications/membersList'
import ResourcesPage from '~/pages/CommunitiesPage/ResourcesPage'
import ContactPage from '~/pages/ContactPage'
import DatasourcesPage from '~/pages/DatasourcesPage/DatasourcesPage'
import FaqsPage from '~/pages/FaqsPage'
import HomePage from '~/pages/HomePage'
import LoginPage from '~/pages/LoginPage'
import NotFoundPage from '~/pages/NotFoundPage'
import SearchPageNew from '~/pages/SearchPageNew'

import AppLayout from '~/layouts/AppLayout'
import CommunityLayout from '~/layouts/CommunityLayout'

import LoginAuth from './components/LoginAuth'
import RequireAuth from './components/RequireAuth'
import AdminRoutes from './routes/AdminRoutes'
import UserRoutes from './routes/UserRoutes'

const ROOT_PATH = '/'
const DISCOVER_COMMUNITY_PATH = '/community/'
const DISCOVER_RESOURCE_PATH = '/community/resources/'

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
    <Route path="/community/invites" element={<CommunityLayout />}>
      <Route
        path=""
        element={
          <RequireAuth>
            <InvitesList />
          </RequireAuth>
        }
      />
    </Route>

    <Route path="/community/membership-requests" element={<CommunityLayout />}>
      <Route
        path=""
        element={
          <RequireAuth>
            <MembersList />
          </RequireAuth>
        }
      />
    </Route>

    <Route path={DISCOVER_COMMUNITY_PATH} element={<CommunityLayout />}>
      {['', 'communities/'].map(path => (
        <Route
          key={path}
          path={path}
          element={
            <RequireAuth>
              <CommunitiesPage />
            </RequireAuth>
          }
        />
      ))}
      <Route
        path="resources/"
        element={
          <RequireAuth>
            <ResourcesPage />
          </RequireAuth>
        }
      />
    </Route>
    <Route path={DISCOVER_RESOURCE_PATH} element={<CommunityLayout />}>
      {/* <Route
        path=""
        element={
          <RequireAuth>
            <CommunityListProvider>
              <ResourceList />
            </CommunityListProvider>
          </RequireAuth>
        }
      /> */}
      <Route
        path=":resourceId/contribution/new"
        element={
          <RequireAuth>
            <CreateContribution />
          </RequireAuth>
        }
      />
    </Route>
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
