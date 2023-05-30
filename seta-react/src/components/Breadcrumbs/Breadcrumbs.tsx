import { Flex, Breadcrumbs as MantineBreadcrumbs, createStyles } from '@mantine/core'
import { AiOutlineHome } from 'react-icons/ai'
import { Link, NavLink, useLocation } from 'react-router-dom'

import * as S from './styles'

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
const Breadcrumbs = () => {
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

  return (
    <Flex align="center" css={S.root}>
      <MantineBreadcrumbs>
        <NavLink to="/" css={S.link}>
          <AiOutlineHome size="1.5rem" />
        </NavLink>
        {crumbs}
      </MantineBreadcrumbs>
    </Flex>
  )
}

export default Breadcrumbs
