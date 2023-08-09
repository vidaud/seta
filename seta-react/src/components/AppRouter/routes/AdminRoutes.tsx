import { Route } from 'react-router-dom'

import AdminCommunityRequests from '~/pages/Admin/CommunityRequests/CommunityRequests'
import AdminDashboard from '~/pages/Admin/Dashboard'
import AdminOrphanedCommunities from '~/pages/Admin/OrphanedCommunities/OrphanedCommunities'
import AdminOrphanedResources from '~/pages/Admin/OrphanedResources/OrpahnedResources'
import AdminResourceRequests from '~/pages/Admin/ResourceRequests/ResourceRequests'
import ManageUser from '~/pages/Admin/Users/ManageUser/ManageUser'
import AdminUsers from '~/pages/Admin/Users/Users'

import AdminLayout from '~/layouts/AdminLayout'
import { UserRole } from '~/types/user'

import RequireAuth from '../components/RequireAuth'

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
