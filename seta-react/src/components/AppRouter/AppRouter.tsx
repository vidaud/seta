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
import ViewCommunity from '../../pages/CommunitiesPage/components/Discovery/ViewCommunity/ViewCommunity'
import ViewResource from '../../pages/CommunitiesPage/components/Discovery/ViewResource/ViewResource'
import ManageCommunity from '../../pages/CommunitiesPage/components/Manage/Community/ManageCommunity/ManageCommunity'
import NewCommunity from '../../pages/CommunitiesPage/components/Manage/Community/NewCommunity/NewCommunity'
import UpdateCommunity from '../../pages/CommunitiesPage/components/Manage/Community/UpdateCommunity/UpdateCommunity'
import ViewMyCommunity from '../../pages/CommunitiesPage/components/Manage/Community/ViewMyCommunity/ViewMyCommunity'
import CreateContribution from '../../pages/CommunitiesPage/components/Manage/Contribution/NewContribution/NewContribution'
import CommunityInvites from '../../pages/CommunitiesPage/components/Manage/Invites/CommunityInvites/CommunityInvites'
import CommunityMembers from '../../pages/CommunitiesPage/components/Manage/Members/CommunityMembers/CommunityMembers'
import NewResource from '../../pages/CommunitiesPage/components/Manage/Resource/NewResource/NewResource'
import UpdateResource from '../../pages/CommunitiesPage/components/Manage/Resource/UpdateResource/UpdateResource'
import ViewMyResource from '../../pages/CommunitiesPage/components/Manage/Resource/ViewMyResource/ViewMyResource'
import CommunityUsersPermissions from '../../pages/CommunitiesPage/components/UserPermissions/Community/CommunityUserPermissions'
import ResourceUsersPermissions from '../../pages/CommunitiesPage/components/UserPermissions/Resource/ResourceUserPermissions'
import DashboardsPage from '../../pages/CommunitiesPage/pages/DashboardPage'
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
import SearchPage from '../../pages/SearchPage/SearchPage'
import SearchPageNew from '../../pages/SearchPageNew'

const ROOT_PATH = '/'
const MANAGE_COMMUNITY_PATH = '/my-communities/'
const MANAGE_RESOURCE_PATH = '/my-resources/'
const DISCOVER_COMMUNITY_PATH = '/communities/'
const DISCOVER_RESOURCE_PATH = '/resources/'

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
    <Route path="dashboard" element={<CommunityLayout />}>
      <Route
        path=""
        element={
          <RequireAuth>
            <DashboardsPage />
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
            <CommunityMembers />
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
            <ViewMyCommunity />
          </RequireAuth>
        }
      />
      <Route
        path=":id/:resourceId"
        element={
          <RequireAuth>
            <ViewMyResource />
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
            <ManageCommunity />
          </RequireAuth>
        }
      />
      <Route
        path="permissions/community/:id/"
        element={
          <RequireAuth>
            <CommunityUsersPermissions />
          </RequireAuth>
        }
      />
      <Route
        path="permissions/resource/:resourceId/"
        element={
          <RequireAuth>
            <ResourceUsersPermissions />
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
            <ViewMyResource />
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
            <CommunityListPage />
          </RequireAuth>
        }
      />
      <Route
        path=":id"
        element={
          <RequireAuth>
            <ViewCommunity />
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
