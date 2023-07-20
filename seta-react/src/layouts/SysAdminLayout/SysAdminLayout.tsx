import { Box, Flex, Navbar, createStyles, rem } from '@mantine/core'
import { IconStatusChange } from '@tabler/icons-react'
import { Outlet } from 'react-router-dom'

import Breadcrumbs from '../../components/Breadcrumbs'
import { LinksGroup } from '../../components/NavbarLinksGroup/NavbarLinksGroup'
import NavbarNested from '../../components/NavbarNested/NavbarNested'
import { CommunityListProvider } from '../../pages/CommunitiesPage/pages/contexts/community-list.context'

const mockdata = [
  {
    label: 'Change Requests',
    icon: IconStatusChange,
    initiallyOpened: true,
    links: [
      { label: 'Community Change Requests', link: '/communities-requests/' },
      { label: 'Resource Change Requests', link: '/resources-requests/' }
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
  mainLinks: {
    paddingLeft: `calc(${theme.spacing.md} * 4)`,
    paddingRight: `calc(${theme.spacing.md} - ${theme.spacing.xs})`,
    paddingBottom: theme.spacing.md
    // textAlign: 'center'
  }
}))

const SysAdminLayout = () => {
  const { classes } = useStyles()
  const links = mockdata.map(item => <LinksGroup {...item} key={item.label} />)

  return (
    <Flex
      direction="column"
      className="sysadmin min-h-screen"
      sx={{ display: '-webkit-inline-box' }}
    >
      <CommunityListProvider>
        <Navbar height={800} width={{ sm: 300 }} p="md" className={classes.navbar}>
          <Navbar.Section className={classes.section}>
            <div className={classes.mainLinks}>Admin Panel</div>
          </Navbar.Section>
          <NavbarNested props={links} />
        </Navbar>
      </CommunityListProvider>
      <Box sx={{ flexGrow: 1, padding: '2rem' }}>
        <Breadcrumbs readFromPath />
        <Outlet />
      </Box>
    </Flex>
  )
}

export default SysAdminLayout
