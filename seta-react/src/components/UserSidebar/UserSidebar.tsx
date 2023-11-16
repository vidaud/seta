import { Flex, Navbar, ScrollArea, Box, clsx, ThemeIcon, NavLink } from '@mantine/core'
import { IoMdCloseCircleOutline } from 'react-icons/io'
import { Link, useLocation } from 'react-router-dom'

import {
  ActiveLink,
  getActiveLink
} from '~/layouts/UserLayout/components/SidebarContent/active-link'
import type { ChildrenProp, ClassNameProp } from '~/types/children-props'

import * as S from './styles'

type Props = {
  withBreadcrumbs?: boolean
} & ChildrenProp &
  ClassNameProp

const Sidebar = ({ className, withBreadcrumbs, children }: Props) => {
  const navbarCls = clsx({ 'with-breadcrumbs': withBreadcrumbs })
  const location = useLocation()
  const activeLink = getActiveLink(location.pathname)

  return (
    <Flex className={className} css={S.wrapper}>
      <Navbar css={S.sidebar} className={navbarCls}>
        <Navbar.Section className="section" grow component={ScrollArea}>
          <Box pt="2rem">{children}</Box>
        </Navbar.Section>
        {/* Account START*/}
        <NavLink
          label="Close Account"
          icon={
            <ThemeIcon variant={activeLink === ActiveLink.CLOSE ? 'outline' : 'light'} size={30}>
              <IoMdCloseCircleOutline size="1rem" />
            </ThemeIcon>
          }
          component={Link}
          to="/profile/close-account"
          css={S.linkPrimary}
          active={activeLink === ActiveLink.CLOSE}
        />
        {/* Account END*/}
      </Navbar>
    </Flex>
  )
}

export default Sidebar
