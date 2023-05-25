import type { MouseEventHandler } from 'react'
import { useEffect, useRef, useState } from 'react'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Menubar } from 'primereact/menubar'
import type { MenuItem, MenuItemTemplateType } from 'primereact/menuitem'
import { TieredMenu } from 'primereact/tieredmenu'
import { Link, NavLink } from 'react-router-dom'

import authentificationService from '../../services/authentification.service'
import storageService from '../../services/storage.service'

import './style.css'

const navLinkTemplate: MenuItemTemplateType = item => {
  const { label, icon, url, command } = item

  if (!url) {
    return <span>{label}</span>
  }

  // Set up the click handler if a command is provided on the item.
  // This will allows us to execute the command when the link is clicked.
  const clickHandler: MouseEventHandler<HTMLAnchorElement> | undefined = command
    ? e =>
        command({
          originalEvent: e,
          item
        })
    : undefined

  return (
    <NavLink to={url} className="p-menuitem-link" onClick={clickHandler}>
      {icon && <i className={icon} />}
      <span className="p-menuitem-text">{label}</span>
    </NavLink>
  )
}

const navStart = (
  <Link to="/" className="mr-5">
    <img alt="SeTa Logo" src="/img/SeTA-logocut-negative.png" height="40" />
  </Link>
)

const navEnd = (
  <Link to="/login">
    <span className="p-menuitem-icon pi pi-sign-in p-menuitem p-menuitem-link border-round" />
  </Link>
)

const Header = () => {
  const dashboard = useRef<TieredMenu>(null)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    const loggedIn = storageService.isLoggedIn()

    // TODO: Move the current user or authentication checks to a context/hook
    setAuthenticated(loggedIn)
  }, [])

  const navMenu: MenuItem[] = [
    {
      label: 'Search',
      className: 'seta-item',
      url: '/search',
      visible: authenticated,
      template: navLinkTemplate
    },
    {
      label: 'Search New [WIP]',
      className: 'seta-item',
      url: '/search-new',
      visible: authenticated,
      template: navLinkTemplate
    },
    {
      label: 'Communities',
      className: 'seta-item',
      url: '/dashboard',
      visible: authenticated,
      template: navLinkTemplate
    },
    {
      label: 'Faqs',
      className: 'seta-item',
      url: '/faqs',
      template: navLinkTemplate
    },
    {
      label: 'Contact',
      className: 'seta-item',
      url: '/contact',
      template: navLinkTemplate
    }
  ]

  // Hide the menu when clicking on a menu item
  const hideMenuCommand = ({ originalEvent }) => dashboard.current?.toggle(originalEvent)

  const dashboardMenu: MenuItem[] = [
    {
      label: 'Profile',
      icon: 'pi pi-fw pi-user',
      url: '/profile',
      template: navLinkTemplate,
      command: hideMenuCommand
    },
    {
      label: 'Dashboard',
      icon: 'pi pi-fw pi-wrench',
      url: '/dashboard',
      template: navLinkTemplate,
      command: hideMenuCommand
    },
    {
      separator: true
    },
    {
      label: 'Sign Out',
      icon: 'pi pi-fw pi-sign-out',

      command: () => {
        authentificationService.setaLogout()
      }
    }
  ]

  const logout = (
    <div>
      <TieredMenu model={dashboardMenu} popup ref={dashboard} id="overlay_tmenu" />

      <Button
        icon="pi pi-user"
        onClick={event => dashboard.current?.toggle(event)}
        aria-haspopup
        aria-controls="overlay_tmenu"
        tooltip="Profile menu"
        tooltipOptions={{ className: 'blue-tooltip', position: 'top' }}
      />
    </div>
  )

  return (
    <div>
      <header className="site-header">
        <div className="container-fluid">
          <a href="https://ec.europa.eu/info/index_en">
            <img
              alt="EC Logo"
              src="https://commission.europa.eu/themes/contrib/oe_theme/dist/ec/images/logo/positive/logo-ec--en.svg"
              height="40"
              className="mr-2"
            />
          </a>

          <div className="p-inputgroup searches">
            <InputText placeholder="Search" type="text" className="search-form" />
            <Button
              label="Search"
              className="searchButton"
              tooltip="Search on the website"
              tooltipOptions={{ className: 'blue-tooltip', position: 'right' }}
            />
          </div>
        </div>
      </header>

      <header className="seta-header">
        <Menubar model={navMenu} start={navStart} end={authenticated ? logout : navEnd} />
      </header>
    </div>
  )
}

export default Header
