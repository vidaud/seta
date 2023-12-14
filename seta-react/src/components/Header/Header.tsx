import { ActionIcon, Flex, Group, Image, Loader, Menu, Tooltip, Grid } from '@mantine/core'
import { AiOutlineUser } from 'react-icons/ai'
import { FaSignInAlt } from 'react-icons/fa'
import { Link, useLocation } from 'react-router-dom'

import { useCurrentUser } from '~/contexts/user-context'
import { UserRole } from '~/types/user'

import AboutDropdown from './components/AboutDropdown/AboutDropdown'
import SiteHeader from './components/SiteHeader'
import { getDropdownItems, getMenuItems, itemIsCollapse, itemIsDivider } from './config'
import * as S from './styles'

import './style.css'

const Header = () => {
  const { user, isLoading: isUserLoading, logout } = useCurrentUser()
  const location = useLocation()
  const authenticated = !!user

  const handleLogout = () => {
    logout().finally(() => {
      window.location.href = '/login'
    })
  }

  const menuItems = getMenuItems(authenticated)

  const dropdownItems = getDropdownItems({
    isAdmin: user?.role.toLowerCase() === UserRole.Administrator,
    onLogout: handleLogout
  })

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
        <Menu.Item
          key={label}
          icon={icon}
          component={Link}
          to={url}
          css={location.pathname === url ? S.activeLink : ''}
        >
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
    <Menu shadow="md" width={200} position="bottom-end" closeOnItemClick={false} id="">
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
        <Grid align="center" pl="2.8%" className="menu-items">
          <Link to="/" className="mr-5">
            <Image alt="SeTa Logo" src="/img/SeTA-logocut-negative.png" width={120} />
          </Link>

          {visibleMenuItems.map(({ to, label }) => (
            <S.MenuLink
              key={to}
              to={to}
              id={
                label === 'Datasources'
                  ? 'datasource-tab'
                  : label === 'Search'
                  ? 'search-tab'
                  : undefined
              }
            >
              {label}
            </S.MenuLink>
          ))}
          <AboutDropdown />
        </Grid>
        <Group>
          <Group className="login-button">{authenticated ? dropdownMenu : loginButton}</Group>
        </Group>
      </Flex>
    </header>
  )
}

export default Header
