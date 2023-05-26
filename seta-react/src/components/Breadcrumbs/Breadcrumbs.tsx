import { Breadcrumbs, createStyles } from '@mantine/core'
import { Link, useLocation } from 'react-router-dom'

const useStyles = createStyles({
  active: {
    color: 'gray',
    ':hover': {
      pointerEvents: 'none'
    }
  },
  link: {},
  breadcrumbs: { paddingBottom: '2rem' }
})

const BreadcrumbsComponent = () => {
  const location = useLocation()
  const { classes } = useStyles()

  let currentLink = ''
  const crumbs = location.pathname
    .split('/')
    .filter(crumb => crumb !== '')
    .map(crumb => {
      currentLink = currentLink + `/${crumb}`
      const list = location.pathname.split('/')
      const last = list[list.length - 1]

      return (
        <Link
          className={`${crumb === last ? classes.active : classes.link}`}
          to={currentLink}
          key={crumb}
        >
          {crumb.charAt(0).toUpperCase() + crumb.slice(1)}
        </Link>
      )
    })

  return <Breadcrumbs className={classes.breadcrumbs}>{crumbs}</Breadcrumbs>
}

export default BreadcrumbsComponent
