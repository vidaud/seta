import { FaUser } from 'react-icons/fa'
import { FiLogOut } from 'react-icons/fi'

type MenuItem = {
  to: string
  label: string
  hidden?: boolean
}

type DropdownItem =
  | {
      label: string
      icon: JSX.Element
      url?: string
      onClick?: () => void
    }
  | { divider: true }

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
  onLogout: () => void
}

export const getDropdownItems = ({ onLogout }: DropdownCallbacks): DropdownItem[] => [
  {
    label: 'Profile',
    icon: <FaUser size="1.1rem" />,
    url: '/profile'
  },
  // {
  //   label: 'Dashboard',
  //   icon: <FaWrench size="1.1rem" />,
  //   url: '/dashboard'
  // },
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
