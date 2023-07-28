import { Outlet } from 'react-router-dom'

import Page from '~/components/Page/Page'

import type { Crumb } from '~/types/breadcrumbs'

import SidebarContent from './components/SidebarContent/SidebarContent'

const breadcrumbs: Crumb[] = [
  {
    title: 'Administration',
    path: '/admin'
  }
]

const sidebar = <SidebarContent />

const AdminLayout = () => {
  return (
    <Page sidebarContent={sidebar} breadcrumbs={breadcrumbs}>
      <Outlet />
    </Page>
  )
}

export default AdminLayout
