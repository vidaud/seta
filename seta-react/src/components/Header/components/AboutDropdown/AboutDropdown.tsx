import { useState } from 'react'
import { Group, Menu, UnstyledButton, Text } from '@mantine/core'
import { IconChevronDown } from '@tabler/icons-react'
import { Link, useLocation } from 'react-router-dom'

import GetStarted from '~/components/GetStarted'

import { getDropdownAbout, itemIsCollapse, itemIsDivider } from '../../config'
import * as S from '../../styles'
import '../../style.css'

const AboutDropdown = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

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

  const aboutDropdown = getDropdownAbout()

  // eslint-disable-next-line array-callback-return
  const aboutDropdownItems = aboutDropdown.map((item, index) => {
    if (itemIsDivider(item)) {
      // eslint-disable-next-line react/no-array-index-key
      return <Menu.Divider key={index} />
    }

    if (itemIsCollapse(item)) {
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

  return (
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
}

export default AboutDropdown
