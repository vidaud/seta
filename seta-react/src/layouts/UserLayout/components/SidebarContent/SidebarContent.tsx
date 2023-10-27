/* eslint-disable complexity */
import { Navbar, ScrollArea, NavLink, Group, ThemeIcon, Title } from '@mantine/core'
import { IconStack2, IconUserCog } from '@tabler/icons-react'
import { BiLibrary } from 'react-icons/bi'
import { FaUserCircle } from 'react-icons/fa'
import { GrUserSettings } from 'react-icons/gr'
import { MdOutlineSettingsApplications } from 'react-icons/md'
import { Link, useLocation } from 'react-router-dom'

import { ActiveLink, getActiveLink } from './active-link'
import * as S from './styles'

const SidebarContent = () => {
  const location = useLocation()
  const activeLink = getActiveLink(location.pathname)

  return (
    <Navbar height={800} pt="md" mt="-2rem">
      {/* Title section START*/}
      <Navbar.Section css={S.header}>
        <Group>
          <GrUserSettings size="1.1rem" color="gray" />
          <Title order={5} c="dimmed">
            User Account
          </Title>
        </Group>
      </Navbar.Section>
      {/* Title section END*/}
      <Navbar.Section grow component={ScrollArea}>
        {/* Profile START*/}
        <NavLink
          label="Profile"
          icon={
            <ThemeIcon
              variant={activeLink === ActiveLink.DASHBOARD ? 'outline' : 'light'}
              size={30}
            >
              <FaUserCircle size="1rem" />
            </ThemeIcon>
          }
          component={Link}
          to="/profile"
          css={S.linkPrimary}
          active={activeLink === ActiveLink.DASHBOARD}
        />
        {/* Profile END*/}

        {/* RSA Keys START*/}
        <NavLink
          label="RSA Keys"
          icon={
            <ThemeIcon variant={activeLink === ActiveLink.RSAKEYS ? 'outline' : 'light'} size={30}>
              <IconUserCog size="1rem" stroke={1.5} />
            </ThemeIcon>
          }
          component={Link}
          to="/profile/rsa-keys"
          css={S.linkPrimary}
          active={activeLink === ActiveLink.RSAKEYS}
        />
        {/* RSA Keys END*/}

        {/* Applications START*/}
        <NavLink
          label="Applications"
          icon={
            <ThemeIcon
              variant={activeLink === ActiveLink.APPLICATIONS ? 'outline' : 'light'}
              size={30}
            >
              <MdOutlineSettingsApplications size="1rem" />
            </ThemeIcon>
          }
          component={Link}
          to="/profile/applications"
          css={S.linkPrimary}
          active={activeLink === ActiveLink.APPLICATIONS}
        />
        {/* Applications END*/}

        {/* Library START*/}
        <NavLink
          label="Library"
          icon={
            <ThemeIcon variant={activeLink === ActiveLink.LIBRARY ? 'outline' : 'light'} size={30}>
              <BiLibrary size="1rem" />
            </ThemeIcon>
          }
          component={Link}
          to="/profile/library"
          css={S.linkPrimary}
          active={activeLink === ActiveLink.LIBRARY}
        />
        {/* Library END*/}
        {/* Restricted Resources START*/}
        <NavLink
          label="Restricted Resources"
          icon={
            <ThemeIcon
              variant={activeLink === ActiveLink.RESTRICTED_RESOURCES ? 'outline' : 'light'}
              size={30}
            >
              <IconStack2 size="1rem" />
            </ThemeIcon>
          }
          component={Link}
          to="/profile/restricted-resources"
          css={S.linkPrimary}
          active={activeLink === ActiveLink.RESTRICTED_RESOURCES}
        />
        {/* Restricted Resources END*/}
      </Navbar.Section>
    </Navbar>
  )
}

export default SidebarContent
