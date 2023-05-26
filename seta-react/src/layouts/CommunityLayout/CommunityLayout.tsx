import { Box, Flex, createStyles } from '@mantine/core'
import { Outlet } from 'react-router-dom'

import BreadcrumbsComponent from '../../components/Breadcrumbs/Breadcrumbs'
import NavbarNested from '../../components/NavbarNested'

const useStyles = createStyles({
  box: { flexGrow: 1, padding: '2rem' }
})

const CommunityLayout = () => {
  const { classes } = useStyles()

  return (
    <Flex direction="column" className="communities min-h-screen">
      <NavbarNested />

      <Box className={(classes.box, 'page')} sx={{ flexGrow: 1, padding: '2rem' }}>
        <BreadcrumbsComponent />
        <Outlet />
      </Box>
    </Flex>
  )
}

export default CommunityLayout
