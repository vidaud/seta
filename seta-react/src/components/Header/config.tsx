import { FaUser } from 'react-icons/fa'
import { FiLogOut } from 'react-icons/fi'

type MenuItem = {
  to: string
  label: string
  hidden?: boolean
  collapse?: boolean
}

type DropdownItem =
  | {
      label: string
      icon: JSX.Element
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
    hidden: !authenticated
  },
  {
    to: '/communities',
    label: 'Communities',
    hidden: !authenticated
  },
  {
    to: '/faqs',
    label: 'Faqs'
  },
  {
    to: '/contact',
    label: 'Contact'
  }
]

type DropdownCallbacks = {
  role?: boolean
  onLogout: () => void
}

// export const getDropdownItems = ({ role, onLogout }: DropdownCallbacks): DropdownItem[] => [
export const getDropdownItems = ({ onLogout }: DropdownCallbacks): DropdownItem[] => [
  {
    label: 'Profile',
    icon: <FaUser size="1.1rem" />,
    url: '/profile'
  },
  // {
  //   label: 'Administrator',
  //   icon: <FaWrench size="1.1rem" />,
  //   url: '/panel',
  //   hidden: !role
  // },
  {
    collapse: true
  },
  {
    divider: true
  },
  {
    label: 'Sign Out',
    icon: <FiLogOut size="1.1rem" />,
    onClick: onLogout
  }
]

export const itemIsDivider = (item: DropdownItem): item is { divider: true } => 'divider' in item

export const itemIsCollapse = (item: DropdownItem): item is { collapse: true } => 'collapse' in item
