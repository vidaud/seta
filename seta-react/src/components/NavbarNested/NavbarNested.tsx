import { Badge, Navbar, ScrollArea, createStyles, rem, UnstyledButton } from '@mantine/core'
import { IconNotes, IconCalendarStats, IconMessage, IconUsersGroup } from '@tabler/icons-react'
import { Link } from 'react-router-dom'

import { useNotificationsRequests } from '../../api/communities/notifications'
import { LinksGroup } from '../NavbarLinksGroup/NavbarLinksGroup'

const mockdata = [
  // {
  //   label: 'Dashboard',
  //   icon: IconGauge,
  //   link: '/dashboard'
  // },
  {
    label: 'Discovery',
    icon: IconNotes,
    initiallyOpened: true,
    links: [
      { label: 'Communities', link: '/communities/' },
      { label: 'Resources', link: '/resources/' }
    ]
  },
  {
    label: 'Manage',
    icon: IconCalendarStats,
    links: [
      { label: 'My Communities', link: '/my-communities/' },
      { label: 'My Resources', link: '/my-resources/' }
    ]
  }
]

const useStyles = createStyles(theme => ({
  navbar: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
    paddingBottom: 0
  },
  section: {
    marginLeft: `calc(${theme.spacing.md} * -1)`,
    marginRight: `calc(${theme.spacing.md} * -1)`,
    marginBottom: theme.spacing.md,

    '&:not(:last-of-type)': {
      borderBottom: `${rem(1)} solid ${
        theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
      }`
    }
  },

  header: {
    padding: theme.spacing.md,
    paddingTop: 0,
    marginLeft: `calc(${theme.spacing.md} * -1)`,
    marginRight: `calc(${theme.spacing.md} * -1)`,
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    borderBottom: `${rem(1)} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
    }`
  },

  links: {
    marginLeft: `calc(${theme.spacing.md} * -1)`,
    marginRight: `calc(${theme.spacing.md} * -1)`
  },

  linksInner: {
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl
  },

  footer: {
    marginLeft: `calc(${theme.spacing.md} * -1)`,
    marginRight: `calc(${theme.spacing.md} * -1)`,
    borderTop: `${rem(1)} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
    }`
  },
  mainLinks: {
    paddingLeft: `calc(${theme.spacing.md} - ${theme.spacing.xs})`,
    paddingRight: `calc(${theme.spacing.md} - ${theme.spacing.xs})`,
    paddingBottom: theme.spacing.md
  },

  mainLink: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    fontSize: theme.fontSizes.xs,
    padding: `${rem(8)} ${theme.spacing.xs}`,
    borderRadius: theme.radius.sm,
    fontWeight: 500,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
      color: theme.colorScheme === 'dark' ? theme.white : theme.black
    }
  },

  mainLinkInner: {
    display: 'flex',
    alignItems: 'center',
    flex: 1
  },

  mainLinkIcon: {
    marginRight: theme.spacing.sm,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6]
  },

  mainLinkBadge: {
    padding: 0,
    width: rem(20),
    height: rem(20),
    pointerEvents: 'none'
  },

  collections: {
    paddingLeft: `calc(${theme.spacing.md} - ${rem(6)})`,
    paddingRight: `calc(${theme.spacing.md} - ${rem(6)})`,
    paddingBottom: theme.spacing.md
  }
}))

const NavbarNested = () => {
  const { classes } = useStyles()
  const { data } = useNotificationsRequests()

  const notification_links = [
    {
      icon: IconMessage,
      label: 'Pending Invites',
      notifications: data?.invites?.filter(invite => invite.status === 'pending').length,
      link: '/invites'
    },
    {
      icon: IconUsersGroup,
      label: 'Pending Membership Requests',
      notifications: data?.memberships?.filter(member => member.status === 'pending').length,
      link: '/membership-requests'
    }
  ]

  const mainLinks = notification_links
    .filter(link => link.notifications && link.notifications > 0)
    .map(link => (
      <UnstyledButton key={link.label} className={classes.mainLink}>
        <div className={classes.mainLinkInner}>
          <link.icon size={20} className={classes.mainLinkIcon} stroke={1.5} />
          <span>{link.label}</span>
        </div>
        {link.notifications && (
          <Link to={link.link}>
            <Badge size="sm" variant="filled" className={classes.mainLinkBadge}>
              {link.notifications}
            </Badge>
          </Link>
        )}
      </UnstyledButton>
    ))

  const links = mockdata.map(item => <LinksGroup {...item} key={item.label} />)

  return (
    <Navbar height={800} width={{ sm: 300 }} p="md" className={classes.navbar}>
      {(data?.invites && data?.invites?.length > 0) ||
      (data?.memberships && data?.memberships?.length > 0) ? (
        <Navbar.Section className={classes.section}>
          <div className={classes.mainLinks}>{mainLinks}</div>
        </Navbar.Section>
      ) : null}
      <Navbar.Section grow className={classes.links} component={ScrollArea}>
        <div className={classes.linksInner}>{links}</div>
      </Navbar.Section>
    </Navbar>
  )
}

export default NavbarNested
