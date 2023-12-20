/* eslint-disable complexity */
import { Navbar, ScrollArea, NavLink, Group, ThemeIcon, Title } from '@mantine/core'
import { IconGauge, IconUserCog } from '@tabler/icons-react'
import { AiOutlineDatabase } from 'react-icons/ai'
import { FaWrench } from 'react-icons/fa'
import { RiMarkupLine } from 'react-icons/ri'
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

        {/* Annotations START*/}
        <NavLink
          label="Annotations"
          icon={
            <ThemeIcon
              variant={activeLink === ActiveLink.ANNOTATIONS ? 'outline' : 'light'}
              size={30}
            >
              <RiMarkupLine size="1rem" stroke="1.5" />
            </ThemeIcon>
          }
          component={Link}
          to="/admin/annotations"
          css={S.linkPrimary}
          active={activeLink === ActiveLink.ANNOTATIONS}
        />
        {/* Annotations END*/}

        {/* Datasources START*/}
        <NavLink
          label="Datasources"
          icon={
            <ThemeIcon
              variant={activeLink === ActiveLink.DATASOURCES ? 'outline' : 'light'}
              size={30}
            >
              <AiOutlineDatabase size="1rem" stroke="1.5" />
            </ThemeIcon>
          }
          component={Link}
          to="/admin/datasources"
          css={S.linkPrimary}
          active={activeLink === ActiveLink.DATASOURCES}
        />
        {/* Annotations END*/}
      </Navbar.Section>
    </Navbar>
  )
}

export default SidebarContent
