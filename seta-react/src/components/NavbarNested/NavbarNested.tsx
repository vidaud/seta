import { Navbar, ScrollArea, createStyles, rem } from '@mantine/core'
import { IconNotes, IconCalendarStats } from '@tabler/icons-react'

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
  }
}))

const NavbarNested = () => {
  const { classes } = useStyles()
  const links = mockdata.map(item => <LinksGroup {...item} key={item.label} />)

  return (
    <Navbar height={800} width={{ sm: 300 }} p="md" className={classes.navbar}>
      <Navbar.Section grow className={classes.links} component={ScrollArea}>
        <div className={classes.linksInner}>{links}</div>
      </Navbar.Section>
    </Navbar>
  )
}

export default NavbarNested
