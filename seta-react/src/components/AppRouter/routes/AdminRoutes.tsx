import React from 'react'
import { Route } from 'react-router-dom'

import AdminLayout from '~/layouts/AdminLayout'
import { UserRole } from '~/types/user'

import RequireAuth from '../components/RequireAuth'

const AdminCommunityRequests = React.lazy(() => import('~/pages/Admin/CommunityRequests'))
const AdminDashboard = React.lazy(() => import('~/pages/Admin/Dashboard'))
const AdminOrphanedCommunities = React.lazy(() => import('~/pages/Admin/OrphanedCommunities'))
const AdminOrphanedResources = React.lazy(() => import('~/pages/Admin/OrphanedResources'))
const AdminResourceRequests = React.lazy(() => import('~/pages/Admin/ResourceRequests'))
const ManageUser = React.lazy(() => import('~/pages/Admin/Users/ManageUser'))
const AdminUsers = React.lazy(() => import('~/pages/Admin/Users/Users'))

const AdminRoutes = (
  <Route
    element={
      <RequireAuth allowedRoles={[UserRole.Administrator]}>
        <AdminLayout />
      </RequireAuth>
    }
  >
    <Route index element={<AdminDashboard />} />
    <Route path="users" element={<AdminUsers />} />
    <Route path="users/:id" element={<ManageUser />} />
    <Route path="community-requests" element={<AdminCommunityRequests />} />
    <Route path="resource-requests" element={<AdminResourceRequests />} />
    <Route path="orphaned-communities" element={<AdminOrphanedCommunities />} />
    <Route path="orphaned-resources" element={<AdminOrphanedResources />} />
  </Route>
)

export default AdminRoutes
