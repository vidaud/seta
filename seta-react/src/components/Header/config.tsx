import { FaUser, FaWrench } from 'react-icons/fa'
import { FiLogOut } from 'react-icons/fi'

type MenuItem = {
  to: string
  label: string
  hidden?: boolean
  collapse?: boolean
  tabId?: string
}

export type DropdownItem =
  | {
      label: string
      icon?: JSX.Element
      url?: string
      hidden?: boolean
      onClick?: () => void
    }
  | { divider: true }
  | { collapse: true }

export const getMenuItems = (authenticated: boolean): MenuItem[] => [
  {
    to: '/search',
    label: 'Search',
    hidden: !authenticated,
    tabId: 'search-tab'
  },
  {
    to: '/data-sources',
    label: 'Data Sources',
    hidden: !authenticated,
    tabId: 'datasource-tab'
  }
]

type DropdownProps = {
  isAdmin?: boolean
  onLogout: () => void
}

export const getDropdownAbout = (): DropdownItem[] => {
  const items: DropdownItem[] = [
    {
      label: 'FAQs',
      url: '/faqs'
    },
    {
      label: 'Contact',
      url: '/contact'
    }
  ]

  items.push({
    divider: true
  })

  items.push({
    label: 'Take a Tour'
  })

  return items
}

export const getDropdownItems = ({ isAdmin, onLogout }: DropdownProps): DropdownItem[] => {
  const items: DropdownItem[] = [
    {
      label: 'Profile',
      icon: <FaUser size="1.1rem" />,
      url: '/profile'
    }
  ]

  if (isAdmin) {
    items.push({
      label: 'Administration',
      icon: <FaWrench size="1.1rem" />,
      url: '/admin'
    })
  }

  items.push({
    collapse: true
  })

  items.push({
    divider: true
  })

  items.push({
    label: 'Sign Out',
    icon: <FiLogOut size="1.1rem" />,
    onClick: onLogout
  })

  return items
}

export const itemIsDivider = (item: DropdownItem): item is { divider: true } => 'divider' in item

export const itemIsCollapse = (item: DropdownItem): item is { collapse: true } => 'collapse' in item
