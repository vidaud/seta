import React from 'react'
import { Route } from 'react-router-dom'

import Annotations from '~/pages/Admin/Annotations'

import AdminLayout from '~/layouts/AdminLayout'
import { UserRole } from '~/types/user'

import RequireAuth from '../components/RequireAuth'

const AdminDashboard = React.lazy(() => import('~/pages/Admin/Dashboard'))
const ManageUser = React.lazy(() => import('~/pages/Admin/Users/ManageUser'))
const AdminUsers = React.lazy(() => import('~/pages/Admin/Users/Users'))
const Datasources = React.lazy(() => import('~/pages/Admin/Datasources/Datasources'))

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
    <Route path="datasources" element={<Datasources />} />
    <Route path="annotations" element={<Annotations />} />
  </Route>
)

export default AdminRoutes
