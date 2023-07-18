import { useEffect } from 'react'
import { Navbar, createStyles, rem, UnstyledButton, Badge } from '@mantine/core'
import { IconExchange, IconMessage } from '@tabler/icons-react'
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

  const mainLinks = notifications
    .filter(link => link && link.count > 0)
    .map(link => (
      <UnstyledButton key={link.label} className={classes.mainLink}>
        <div className={classes.mainLinkInner}>
          {link.type === 'invites' ? (
            <IconMessage size={20} className={classes.mainLinkIcon} stroke={1.5} />
          ) : link.type === 'membership-request' ? (
            <IconMessage size={20} className={classes.mainLinkIcon} stroke={1.5} />
          ) : (
            <IconExchange size={20} className={classes.mainLinkIcon} stroke={1.5} />
          )}
          <span>{link.label}</span>
        </div>
        {link && (
          <Link
            to={
              link.type === 'invites'
                ? '/invites'
                : link.type === 'membership-request'
                ? '/membership-requests'
                : 'change-request'
            }
          >
            <Badge size="sm" variant="filled" className={classes.mainLinkBadge}>
              {link.count}
            </Badge>
          </Link>
        )}
      </UnstyledButton>
    ))

  return (
    <>
      {notifications.length > 0 ? (
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
