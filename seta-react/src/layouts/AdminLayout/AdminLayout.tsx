import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'

import Page from '~/components/Page/Page'
import PageLoader from '~/components/PageLoader'

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
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
    </Page>
  )
}

export default AdminLayout
