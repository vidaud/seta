/* eslint-disable complexity */
import { Navbar, ScrollArea, NavLink, Group, ThemeIcon, Title } from '@mantine/core'
import { IconGauge, IconUserCog } from '@tabler/icons-react'
import { FaWrench } from 'react-icons/fa'
import { Link, useLocation } from 'react-router-dom'

import { ActiveLink, getActiveLink } from './active-link'
import * as S from './styles'

const SidebarContent = () => {
  const location = useLocation()
  const activeLink = getActiveLink(location.pathname)

  return (
    <Navbar height={800} mt="-2rem">
      {/* Title section START*/}
      <Navbar.Section css={S.header}>
        <Group p="md">
          <FaWrench size="1.1rem" color="gray" />
          <Title order={4} c="dimmed">
            Administration
          </Title>
        </Group>
      </Navbar.Section>
      {/* Title section END*/}
      <Navbar.Section grow component={ScrollArea}>
        {/* Dashboard START*/}
        <NavLink
          label="Dashboard"
          icon={
            <ThemeIcon
              variant={activeLink === ActiveLink.DASHBOARD ? 'outline' : 'light'}
              size={30}
            >
              <IconGauge size="1rem" stroke={1.5} />
            </ThemeIcon>
          }
          component={Link}
          to="/admin"
          css={S.linkPrimary}
          active={activeLink === ActiveLink.DASHBOARD}
        />
        {/* Dashboard END*/}

        {/* Users START*/}
        <NavLink
          label="Users"
          icon={
            <ThemeIcon variant={activeLink === ActiveLink.USERS ? 'outline' : 'light'} size={30}>
              <IconUserCog size="1rem" stroke={1.5} />
            </ThemeIcon>
          }
          component={Link}
          to="/admin/users"
          css={S.linkPrimary}
          active={activeLink === ActiveLink.USERS}
        />
        {/* Users END*/}
      </Navbar.Section>
    </Navbar>
  )
}

export default SidebarContent
