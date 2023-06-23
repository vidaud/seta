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
import ViewResource from '../../pages/CommunitiesPage/components/Discovery/ResourceList/components/ViewResource/ViewResource'
import NewCommunity from '../../pages/CommunitiesPage/components/Manage/Community/CreateCommunity/components/NewCommunity/NewCommunity'
import ManageCommunity from '../../pages/CommunitiesPage/components/Manage/Community/ManageCommunity/ManageCommunity'
import UpdateCommunity from '../../pages/CommunitiesPage/components/Manage/Community/UpdateCommunity/UpdateCommunity'
import ViewCommunity from '../../pages/CommunitiesPage/components/Manage/Community/ViewCommunity/ViewCommunity'
import CreateContribution from '../../pages/CommunitiesPage/components/Manage/Contribution/NewContribution/NewContribution'
import CommunityInvites from '../../pages/CommunitiesPage/components/Manage/Invites/CommunityInvites/CommunityInvites'
import CommunityMembers from '../../pages/CommunitiesPage/components/Manage/Members/CommunityMembers/CommunityMembers'
import NewResource from '../../pages/CommunitiesPage/components/Manage/Resource/NewResource/NewResource'
import UpdateResource from '../../pages/CommunitiesPage/components/Manage/Resource/UpdateResource/UpdateResource'
import ViewMyResource from '../../pages/CommunitiesPage/components/Manage/Resource/ViewMyResource/ViewMyResource'
import InvitesList from '../../pages/CommunitiesPage/components/Sidebar/InvitesList/InvitesList'
import MembersList from '../../pages/CommunitiesPage/components/Sidebar/MembersList/MembersList'
import { ScopeProvider } from '../../pages/CommunitiesPage/contexts/scope-context'
import CommunityListPage from '../../pages/CommunitiesPage/pages/Discovery/CommunityList/CommunityList'
import ResourceListPage from '../../pages/CommunitiesPage/pages/Discovery/ResourceList/ResourceList'
import MyCommunityListPage from '../../pages/CommunitiesPage/pages/Manage/MyCommunityList/MyCommunityList'
import MyResourceListPage from '../../pages/CommunitiesPage/pages/Manage/MyResourceList/MyResourceList'
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
const MANAGE_COMMUNITY_PATH = '/my-communities/'
const MANAGE_RESOURCE_PATH = '/my-resources/'
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
    <Route path="/membership-requests" element={<CommunityLayout />}>
      <Route
        path=""
        element={
          <RequireAuth>
            <MembersList />
          </RequireAuth>
        }
      />
    </Route>
    <Route path={MANAGE_COMMUNITY_PATH} element={<CommunityLayout />}>
      <Route
        path=""
        element={
          <RequireAuth>
            <MyCommunityListPage />
          </RequireAuth>
        }
      />
      <Route
        path="new"
        element={
          <RequireAuth>
            <NewCommunity />
          </RequireAuth>
        }
      />
      <Route
        path=":id/update"
        element={
          <RequireAuth>
            <UpdateCommunity />
          </RequireAuth>
        }
      />
      <Route
        path=":id/members"
        element={
          <RequireAuth>
            <ScopeProvider>
              <CommunityMembers />
            </ScopeProvider>
          </RequireAuth>
        }
      />
      <Route
        path=":id/invites"
        element={
          <RequireAuth>
            <CommunityInvites />
          </RequireAuth>
        }
      />
      <Route
        path=":id"
        element={
          <RequireAuth>
            <ScopeProvider>
              <ViewCommunity />
            </ScopeProvider>
          </RequireAuth>
        }
      />
      <Route
        path=":id/:resourceId"
        element={
          <RequireAuth>
            <ScopeProvider>
              <ViewMyResource />
            </ScopeProvider>
          </RequireAuth>
        }
      />
      <Route
        path=":id/:resourceId/update"
        element={
          <RequireAuth>
            <ScopeProvider>
              <UpdateResource />
            </ScopeProvider>
          </RequireAuth>
        }
      />
      <Route
        path=":id/new"
        element={
          <RequireAuth>
            <NewResource />
          </RequireAuth>
        }
      />
      <Route
        path=":id/manage"
        element={
          <RequireAuth>
            <ScopeProvider>
              <ManageCommunity />
            </ScopeProvider>
          </RequireAuth>
        }
      />
    </Route>
    <Route path={MANAGE_RESOURCE_PATH} element={<CommunityLayout />}>
      <Route
        path=""
        element={
          <RequireAuth>
            <MyResourceListPage />
          </RequireAuth>
        }
      />
      <Route
        path=":resourceId"
        element={
          <RequireAuth>
            <ScopeProvider>
              <ViewMyResource />
            </ScopeProvider>
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
      <Route
        path=":resourceId/update"
        element={
          <RequireAuth>
            <UpdateResource />
          </RequireAuth>
        }
      />
    </Route>

    <Route path={DISCOVER_COMMUNITY_PATH} element={<CommunityLayout />}>
      <Route
        path=""
        element={
          <RequireAuth>
            <ScopeProvider>
              <CommunityListPage />
            </ScopeProvider>
          </RequireAuth>
        }
      />
      <Route
        path=":id"
        element={
          <RequireAuth>
            <ScopeProvider>
              <ViewCommunity />
            </ScopeProvider>
          </RequireAuth>
        }
      />
    </Route>
    <Route path={DISCOVER_RESOURCE_PATH} element={<CommunityLayout />}>
      <Route
        path=""
        element={
          <RequireAuth>
            <ResourceListPage />
          </RequireAuth>
        }
      />
      <Route
        path=":id"
        element={
          <RequireAuth>
            <ViewResource />
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
