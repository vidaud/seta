import { useEffect } from 'react'
import { Badge, Navbar, createStyles, rem, UnstyledButton } from '@mantine/core'
import { IconMessage, IconUsersGroup } from '@tabler/icons-react'
import { Link } from 'react-router-dom'

import { ComponentLoading } from '../../pages/CommunitiesPage/components/common'
import { useNotifications } from '../../pages/CommunitiesPage/pages/contexts/notifications-context'

const useStyles = createStyles(theme => ({
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

const SidebarNotifications = () => {
  const { classes } = useStyles()
  const { notifications, getNotificationRequests } = useNotifications()

  useEffect(() => {
    getNotificationRequests()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notifications])

  if (!notifications) {
    return <ComponentLoading />
  }

  const notification_links = [
    {
      icon: IconMessage,
      label: 'Pending Invites',
      notifications:
        notifications.length > 0
          ? notifications[0].invites?.filter(invite => invite.status === 'pending').length
          : 0,
      link: '/invites'
    },
    {
      icon: IconUsersGroup,
      label: 'Pending Membership Requests',
      notifications:
        notifications.length > 0
          ? notifications[0].memberships?.filter(member => member.status === 'pending').length
          : 0,
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

  return (
    <>
      {(notifications.length > 0 &&
        notifications[0].invites &&
        notifications[0].invites?.length > 0) ||
      (notifications.length > 0 &&
        notifications[0].memberships &&
        notifications[0].memberships?.length > 0) ? (
        <>
          <Navbar.Section className={classes.section}>
            <div className={classes.mainLinks}>{mainLinks}</div>
          </Navbar.Section>
        </>
      ) : null}
    </>
  )
}

export default SidebarNotifications
