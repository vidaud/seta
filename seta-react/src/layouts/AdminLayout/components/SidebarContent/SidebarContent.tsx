/* eslint-disable complexity */
import { Navbar, ScrollArea, NavLink, Group, Text, ThemeIcon, Badge, Title } from '@mantine/core'
import { IconGauge, IconUserCog, IconGitPullRequest, IconAlertOctagon } from '@tabler/icons-react'
import { FaWrench } from 'react-icons/fa'
import { Link, useLocation } from 'react-router-dom'

import { useAdminSidebarStats } from '~/api/admin/menu-stats'

import { ActiveLink, getActiveLink } from './active-link'
import * as S from './styles'

const SidebarContent = () => {
  const location = useLocation()
  const activeLink = getActiveLink(location.pathname)

  const { data } = useAdminSidebarStats()

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

        {/* Change requests START*/}
        <NavLink
          label={
            <Group position="apart">
              <Text>Change requests</Text>
              <Badge color={!data?.totalChangeRequests ? 'gray' : 'orange'}>
                {data?.totalChangeRequests ?? 0}
              </Badge>
            </Group>
          }
          icon={
            <ThemeIcon variant="light" size={30}>
              <IconGitPullRequest size="1rem" stroke={1.5} />
            </ThemeIcon>
          }
          childrenOffset={28}
          css={S.linkPrimary}
          variant="subtle"
          active={
            activeLink === ActiveLink.COMMUNITY_REQUESTS ||
            activeLink === ActiveLink.RESOURCE_REQUESTS
          }
          defaultOpened={!data?.totalChangeRequests}
        >
          <NavLink
            label={
              <Group position="apart">
                <Text>Community requests</Text>
                <Badge color={!data?.communityChangeRequests ? 'gray' : 'orange'}>
                  {data?.communityChangeRequests ?? 0}
                </Badge>
              </Group>
            }
            component={Link}
            to="/admin/community-requests"
            css={S.linkChild}
            active={activeLink === ActiveLink.COMMUNITY_REQUESTS}
          />
          <NavLink
            label={
              <Group position="apart">
                <Text>Resource requests</Text>
                <Badge color={!data?.resourceChangeRequests ? 'gray' : 'orange'}>
                  {data?.resourceChangeRequests ?? 0}
                </Badge>
              </Group>
            }
            component={Link}
            to="/admin/resource-requests"
            css={S.linkChild}
            active={activeLink === ActiveLink.RESOURCE_REQUESTS}
          />
        </NavLink>
        {/* Change requests END*/}

        {/* Orphans START*/}
        <NavLink
          label={
            <Group position="apart">
              <Text>Orphanes</Text>
              <Badge color={!data?.totalOrphans ? 'gray' : 'orange'}>
                {data?.totalOrphans ?? 0}
              </Badge>
            </Group>
          }
          icon={
            <ThemeIcon variant="light" size={30}>
              <IconAlertOctagon size="1rem" stroke={1.5} />
            </ThemeIcon>
          }
          childrenOffset={28}
          css={S.linkPrimary}
          variant="subtle"
          active={
            activeLink === ActiveLink.ORPHANED_COMMUNITIES ||
            activeLink === ActiveLink.ORPHANED_RESOURCES
          }
          defaultOpened={!data?.totalOrphans}
        >
          <NavLink
            label={
              <Group position="apart">
                <Text>Orphaned communities</Text>
                <Badge color={!data?.orphanedCommunities ? 'gray' : 'orange'}>
                  {data?.orphanedCommunities ?? 0}
                </Badge>
              </Group>
            }
            component={Link}
            to="/admin/orphaned-communities"
            css={S.linkChild}
            active={activeLink === ActiveLink.ORPHANED_COMMUNITIES}
          />
          <NavLink
            label={
              <Group position="apart">
                <Text>Orphaned resources</Text>
                <Badge color={!data?.orphanedResources ? 'gray' : 'orange'}>
                  {data?.orphanedResources ?? 0}
                </Badge>
              </Group>
            }
            component={Link}
            to="/admin/orphaned-resources"
            css={S.linkChild}
            active={activeLink === ActiveLink.ORPHANED_RESOURCES}
          />
        </NavLink>
        {/* Orphans END*/}
      </Navbar.Section>
    </Navbar>
  )
}

export default SidebarContent
