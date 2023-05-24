import { Breadcrumbs } from '@mantine/core'
import { Link, useLocation } from 'react-router-dom'

const BreadcrumbsComponent = () => {
  const location = useLocation()

  let currentLink = ''
  const crumbs = location.pathname
    .split('/')
    .filter(crumb => crumb !== '')
    .map(crumb => {
      currentLink = currentLink + `/${crumb}`

      return (
        <Link to={currentLink} key={crumb}>
          {crumb}
        </Link>
      )
    })

  return <Breadcrumbs sx={{ paddingBottom: '2rem' }}>{crumbs}</Breadcrumbs>
}

export default BreadcrumbsComponent
