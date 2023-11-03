import { useState } from 'react'
import {
  ActionIcon,
  Flex,
  Group,
  Image,
  Loader,
  Menu,
  Tooltip,
  Grid,
  UnstyledButton,
  Text
} from '@mantine/core'
import { IconChevronDown } from '@tabler/icons-react'
import { AiOutlineUser } from 'react-icons/ai'
import { FaSignInAlt } from 'react-icons/fa'
import { Link, useLocation } from 'react-router-dom'

import { UserRole } from '~/types/user'

import NotificationsButton from './components/NotificationsButton'
import SiteHeader from './components/SiteHeader'
import {
  getDropdownItems,
  getDropdownAbout,
  getMenuItems,
  itemIsCollapse,
  itemIsDivider
} from './config'
import * as S from './styles'

import { useCurrentUser } from '../../contexts/user-context'
import './style.css'
import GetStarted from '../GetStarted/GetStarted'

const Header = () => {
  const { user, isLoading: isUserLoading, logout } = useCurrentUser()
  const [isOpen, setIsOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const authenticated = !!user

  const handleLogout = () => {
    logout().finally(() => {
      window.location.href = '/login'
    })
  }

  const handleToggle = () => {
    setIsOpen(current => !current)
    setMenuOpen(current => !current)
  }

  const handleToggleMenu = () => {
    setIsOpen(false)
    setMenuOpen(false)
  }

  const handleCloseMenu = value => {
    setMenuOpen(value)
  }

  const menuItems = getMenuItems(authenticated)

  const aboutDropdown = getDropdownAbout()
  const dropdownItems = getDropdownItems({
    isAdmin: user?.role.toLowerCase() === UserRole.Administrator,
    onLogout: handleLogout
  })

  const visibleMenuItems = menuItems.filter(link => !link.hidden && !link.collapse)

  // eslint-disable-next-line array-callback-return
  const aboutDropdownItems = aboutDropdown.map((item, index) => {
    if (itemIsDivider(item)) {
      // eslint-disable-next-line react/no-array-index-key
      return <Menu.Divider key={index} />
    }

    if (itemIsCollapse(item)) {
      // eslint-disable-next-line react/no-array-index-key
      return null
    }

    const { label, url } = item

    if (url) {
      return (
        <Menu.Item
          key={label}
          component={Link}
          to={url}
          css={location.pathname === url ? S.activePath : ''}
        >
          {label}
        </Menu.Item>
      )
    }

    if (!url) {
      return <GetStarted key={label} onChange={handleCloseMenu} />
    }
  })

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

  const aboutDropdownMenu = (
    <Menu
      shadow="md"
      width={200}
      position="bottom"
      id="about"
      onClose={handleToggleMenu}
      opened={menuOpen}
    >
      <Menu.Target>
        <UnstyledButton css={S.button} onClick={handleToggle}>
          <Group>
            <Text size="md">About</Text>
            <IconChevronDown css={S.chevron} data-open={isOpen} size="1rem" />
          </Group>
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown css={S.aboutDropdown}>{aboutDropdownItems}</Menu.Dropdown>
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
                label === 'Communities'
                  ? 'community-tab'
                  : label === 'Search'
                  ? 'search-tab'
                  : undefined
              }
            >
              {label}
            </S.MenuLink>
          ))}
          {aboutDropdownMenu}
        </Grid>
        <Group>
          <Group className="login-button">
            {authenticated ? <NotificationsButton dropdownItems={dropdownItems} /> : null}
            {authenticated ? dropdownMenu : loginButton}
          </Group>
        </Group>
      </Flex>
    </header>
  )
}

export default Header
