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
import ManageCommunity from '../../pages/CommunitiesPage/components/Manage/Community/ManageCommunity/ManageCommunity'
import NewCommunity from '../../pages/CommunitiesPage/components/Manage/Community/NewCommunity/NewCommunity'
import UpdateCommunity from '../../pages/CommunitiesPage/components/Manage/Community/UpdateCommunity/UpdateCommunity'
import ViewMyCommunity from '../../pages/CommunitiesPage/components/Manage/Community/ViewMyCommunity/ViewMyCommunity'
import CreateContribution from '../../pages/CommunitiesPage/components/Manage/Contribution/NewContribution/NewContribution'
import { Main } from '../../pages/CommunitiesPage/components/Manage/Contribution_copy/StepperContent/Main'
import CommunityInvites from '../../pages/CommunitiesPage/components/Manage/Invites/CommunityInvites/CommunityInvites'
import CommunityMembers from '../../pages/CommunitiesPage/components/Manage/Members/CommunityMembers/CommunityMembers'
import NewResource from '../../pages/CommunitiesPage/components/Manage/Resource/NewResource/NewResource'
import UpdateResource from '../../pages/CommunitiesPage/components/Manage/Resource/UpdateResource/UpdateResource'
import ViewMyResource from '../../pages/CommunitiesPage/components/Manage/Resource/ViewResource/ViewResource'
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
import SearchPage from '../../pages/SearchPage'
import SearchPageNew from '../../pages/SearchPageNew'

const ROOT_PATH = '/'
const COMMUNITY_PATH = '/communities'
const DISCOVER_PATH = '/discover'

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
        path="view/:id"
        element={
          <RequireAuth>
            <ViewCommunity />
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
      <Route
        path="new"
        element={
          <RequireAuth>
            <NewCommunity />
          </RequireAuth>
        }
      />
      <Route
        path="update/:id"
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
        path="details/:id"
        element={
          <RequireAuth>
            <ViewMyCommunity />
          </RequireAuth>
        }
      />
      <Route
        path="details/:id/new"
        element={
          <RequireAuth>
            <NewResource />
          </RequireAuth>
        }
      />
      <Route
        path="my-resources"
        element={
          <RequireAuth>
            <MyResourceListPage />
          </RequireAuth>
        }
      />
      <Route
        path="manage/:id"
        element={
          <RequireAuth>
            <ManageCommunity />
          </RequireAuth>
        }
      />
      <Route
        path="details/:id/:resourceId"
        element={
          <RequireAuth>
            <ViewMyResource />
          </RequireAuth>
        }
      />
      <Route
        path="details/:id/:resourceId/contribution/new"
        element={
          <RequireAuth>
            <CreateContribution />
          </RequireAuth>
        }
      />
      <Route
        path="details/:id/:resourceId/contribution/news"
        element={
          <RequireAuth>
            <Main />
          </RequireAuth>
        }
      />
      <Route
        path="update/:id/:resourceId"
        element={
          <RequireAuth>
            <UpdateResource />
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
    <Route path={DISCOVER_PATH} element={<CommunityLayout />}>
      <Route
        path="communities"
        element={
          <RequireAuth>
            <CommunityListPage />
          </RequireAuth>
        }
      />
      <Route
        path="resources"
        element={
          <RequireAuth>
            <ResourceListPage />
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
