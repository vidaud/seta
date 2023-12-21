import React from 'react'
import { Route } from 'react-router-dom'

import GenerateKeyInstructions from '~/components/GenerateKeyInstructions/GenerateKeyInstructions'
import CloseUserAccount from '~/pages/UserProfile/CloseUserAccount'

import UserLayout from '~/layouts/UserLayout'

import RequireAuth from '../components/RequireAuth'

const ProfileDashboard = React.lazy(() => import('~/pages/UserProfile/Profile/Profile'))
const AuthKey = React.lazy(() => import('~/pages/UserProfile/AuthKey/AuthKey'))
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
    <Route path="auth-key" element={<AuthKey />} />
    <Route path="applications" element={<Applications />} />
    <Route path="close-account" element={<CloseUserAccount />} />
    <Route path="key-generation-instructions" element={<GenerateKeyInstructions />} />
  </Route>
)

export default UserRoutes
