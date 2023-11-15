import React from 'react'
import { Route } from 'react-router-dom'

import CloseUserAccount from '~/pages/UserProfile/CloseUserAccount'

import UserLayout from '~/layouts/UserLayout'

import RequireAuth from '../components/RequireAuth'

const ProfileDashboard = React.lazy(() => import('~/pages/UserProfile/Profile/Profile'))
const Permissions = React.lazy(() => import('~/pages/UserProfile/Permissions/Permissions'))
const RSAKeys = React.lazy(() => import('~/pages/UserProfile/RSAKeys/RSAKeys'))
const Applications = React.lazy(() => import('~/pages/UserProfile/Applications/Applications'))

const UserRoutes = (
  <Route
    element={
      <RequireAuth>
        <UserLayout />
      </RequireAuth>
    }
  >
    <Route index element={<ProfileDashboard />} />
    <Route path="permissions" element={<Permissions />} />
    <Route path="rsa-keys" element={<RSAKeys />} />
    <Route path="applications" element={<Applications />} />
    <Route path="close-account" element={<CloseUserAccount />} />
  </Route>
)

export default UserRoutes
