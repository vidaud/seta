import { ActionIcon, Flex, Image, Loader, Menu, Tooltip } from '@mantine/core'
import { AiOutlineUser } from 'react-icons/ai'
import { FaSignInAlt } from 'react-icons/fa'
import { Link } from 'react-router-dom'

import { useCurrentUser } from '~/contexts/user-context'

import SiteHeader from './components/SiteHeader'
import { getDropdownItems, getMenuItems, itemIsDivider } from './config'
import * as S from './styles'

import './style.css'

const Header = () => {
  const { user, isLoading: isUserLoading, logout } = useCurrentUser()

  const authenticated = !!user

  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  const menuItems = getMenuItems(authenticated)
  const dropdownItems = getDropdownItems({ onLogout: handleLogout })

  const visibleMenuItems = menuItems.filter(link => !link.hidden)

  const dropdownMenuItems = dropdownItems.map((item, index) => {
    if (itemIsDivider(item)) {
      // eslint-disable-next-line react/no-array-index-key
      return <Menu.Divider key={index} />
    }

    const { label, icon, url, onClick } = item

    if (url) {
      return (
        <Menu.Item key={label} icon={icon} component={Link} to={url}>
          {label}
        </Menu.Item>
      )
    }

    return (
      <Menu.Item key={label} icon={icon} onClick={onClick}>
        {label}
      </Menu.Item>
    )
  })

  const dropdownMenu = (
    <Menu shadow="md" width={200} position="bottom-end">
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
        <Flex align="center">
          <Link to="/" className="mr-5">
            <Image alt="SeTa Logo" src="/img/SeTA-logocut-negative.png" width={120} />
          </Link>

          {visibleMenuItems.map(({ to, label }) => (
            <S.MenuLink key={to} to={to}>
              {label}
            </S.MenuLink>
          ))}
        </Flex>

        {authenticated ? dropdownMenu : loginButton}
      </Flex>
    </header>
  )
}

export default Header
