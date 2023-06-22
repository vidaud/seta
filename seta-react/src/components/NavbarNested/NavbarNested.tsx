import { Navbar, ScrollArea, createStyles } from '@mantine/core'

const useStyles = createStyles(theme => ({
  links: {
    marginLeft: `calc(${theme.spacing.md} * -1)`,
    marginRight: `calc(${theme.spacing.md} * -1)`
  },

  linksInner: {
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl
  }
}))

const NavbarNested = ({ props }) => {
  const { classes } = useStyles()

  return (
    <Navbar.Section grow className={classes.links} component={ScrollArea}>
      <div className={classes.linksInner}>{props}</div>
    </Navbar.Section>
  )
}

export default NavbarNested
