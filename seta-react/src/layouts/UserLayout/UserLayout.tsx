import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'

import PageLoader from '~/components/PageLoader'
import UserPage from '~/components/UserPage'

import type { Crumb } from '~/types/breadcrumbs'

import SidebarContent from './components/SidebarContent'

const breadcrumbs: Crumb[] = [
  {
    title: 'User Account',
    path: '/profile'
  }
]

const sidebar = <SidebarContent />

const UserLayout = () => {
  return (
    <UserPage sidebarContent={sidebar} breadcrumbs={breadcrumbs}>
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
    </UserPage>
  )
}

export default UserLayout
