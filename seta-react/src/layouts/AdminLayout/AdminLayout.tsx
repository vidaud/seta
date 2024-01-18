import { Suspense } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import Page from '~/components/Page/Page'
import PageLoader from '~/components/PageLoader'

import type { Crumb } from '~/types/breadcrumbs'

import { ActiveLink, getActiveLink } from './components/SidebarContent/active-link'
import SidebarContent from './components/SidebarContent/SidebarContent'

const createBreadcrumbs = (activeLink: ActiveLink) => {
  const breadcrumbs: Crumb[] = [
    {
      title: 'Administration',
      path: '/admin'
    }
  ]

  if (activeLink === ActiveLink.USERS) {
    breadcrumbs.push({
      title: 'Users',
      path: '/admin/users'
    })
  }

  if (activeLink === ActiveLink.ANNOTATIONS) {
    breadcrumbs.push({
      title: 'Annotations',
      path: '/admin/annotations'
    })
  }

  if (activeLink === ActiveLink.DATA_SOURCES) {
    breadcrumbs.push({
      title: 'Data Sources',
      path: '/admin/data-sources'
    })
  }

  return breadcrumbs
}

const sidebar = <SidebarContent />

const AdminLayout = () => {
  const location = useLocation()
  const activeLink = getActiveLink(location.pathname)

  const breadcrumbs = createBreadcrumbs(activeLink)

  return (
    <Page sidebarContent={sidebar} breadcrumbs={breadcrumbs}>
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
    </Page>
  )
}

export default AdminLayout
