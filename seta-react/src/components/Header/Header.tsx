import { ActionIcon, Flex, Group, Image, Loader, Menu, Tooltip, Badge, Grid } from '@mantine/core'
import { AiOutlineUser } from 'react-icons/ai'
import { FaSignInAlt } from 'react-icons/fa'
import { Link } from 'react-router-dom'

import NotificationsMenu from './components/NotificationsMenu'
import SiteHeader from './components/SiteHeader'
import { getDropdownItems, getMenuItems, itemIsCollapse, itemIsDivider } from './config'
import * as S from './styles'

import { useCurrentUser } from '../../contexts/user-context'

import './style.css'

const Header = () => {
  const { user, isLoading: isUserLoading, logout, notifications, total } = useCurrentUser()

  const authenticated = !!user
  const role = user?.role === 'Administrator'

  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  const menuItems = getMenuItems(authenticated)
  const dropdownItems = getDropdownItems({ role, onLogout: handleLogout })

  const visibleMenuItems = menuItems.filter(link => !link.hidden && !link.collapse)

  const dropdownMenuItems = dropdownItems.map((item, index) => {
    if (itemIsDivider(item)) {
      // eslint-disable-next-line react/no-array-index-key
      return <Menu.Divider key={index} />
    }

    if (itemIsCollapse(item)) {
      // eslint-disable-next-line react/no-array-index-key
      return null
    }

    const { label, icon, url, hidden, onClick } = item

    if (!hidden && url) {
      return (
        <Menu.Item key={label} icon={icon} component={Link} to={url}>
          {label}
        </Menu.Item>
      )
    }

    return !hidden ? (
      <Menu.Item key={label} icon={icon} onClick={onClick}>
        {label}
      </Menu.Item>
    ) : null
  })

  const dropdownMenu = (
    <Menu shadow="md" width={200} position="bottom-end" closeOnItemClick={false}>
      <Menu.Target>
        <ActionIcon css={S.dropdownTarget} variant="outline" color="gray.1" radius="xl" size="xl">
          <AiOutlineUser size="1.3rem" />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown css={S.dropdown}>{dropdownMenuItems}</Menu.Dropdown>
    </Menu>
  )

  const loginButton = (
    <Tooltip label="Sign in">
      <ActionIcon
        variant={isUserLoading ? 'transparent' : 'outline'}
        color="gray.1"
        radius="xl"
        size="xl"
        component={Link}
        to="/login"
        disabled={isUserLoading}
      >
        {isUserLoading ? <Loader size="sm" color="gray.3" /> : <FaSignInAlt size="1.3rem" />}
      </ActionIcon>
    </Tooltip>
  )

  return (
    <header>
      <SiteHeader />

      <Flex css={S.menu} align="center" justify="space-between">
        <Grid align="center">
          <Link to="/" className="mr-5">
            <Image alt="SeTa Logo" src="/img/SeTA-logocut-negative.png" width={120} />
          </Link>

          {visibleMenuItems.map(({ to, label }) => (
            <S.MenuLink key={to} to={to}>
              {label}
            </S.MenuLink>
          ))}
        </Grid>
        <Group>
          {authenticated ? (
            <Group>
              <NotificationsMenu dropdownItems={dropdownItems} notifications={notifications} />
              {total > 0 ? (
                <Badge variant="filled" size="xs" css={S.badge}>
                  {total}
                </Badge>
              ) : null}
            </Group>
          ) : null}
          {authenticated ? dropdownMenu : loginButton}
        </Group>
      </Flex>
    </header>
  )
}

export default Header
