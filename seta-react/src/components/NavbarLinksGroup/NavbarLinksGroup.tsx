import { useEffect, useState } from 'react'
import {
  Box,
  Collapse,
  Text,
  UnstyledButton,
  createStyles,
  rem,
  getStylesRef,
  Tooltip
} from '@mantine/core'
import type { TablerIconsProps } from '@tabler/icons-react'
import { useLocation, useNavigate } from 'react-router-dom'

const useStyles = createStyles(theme => ({
  control: {
    fontWeight: 500,
    display: 'none',
    width: '100%',
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
    fontSize: theme.fontSizes.sm,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
      color: theme.colorScheme === 'dark' ? theme.white : theme.black
    }
  },

  link: {
    fontWeight: 500,
    display: 'flex',
    textDecoration: 'none',
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
    // paddingLeft: rem(31),
    // marginLeft: rem(30),
    fontSize: theme.fontSizes.sm,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
    // borderLeft: `${rem(1)} solid ${
    //   theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
    // }`,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
      color: theme.colorScheme === 'dark' ? theme.white : theme.black
    }
  },

  chevron: {
    transition: 'transform 200ms ease'
  },

  linkActive: {
    '&, &:hover': {
      backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
      color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
      [`& .${getStylesRef('icon')}`]: {
        color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color
      }
    }
  },

  linkIcon: {
    ref: getStylesRef('icon'),
    color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
    marginRight: theme.spacing.sm
  }
}))

interface LinksGroupProps {
  icon: React.FC<any>
  label: string
  initiallyOpened?: boolean
  links?: { label: string; link: string; icon: (props: TablerIconsProps) => JSX.Element }[]
}

export const LinksGroup = ({ initiallyOpened, links }: LinksGroupProps) => {
  const { classes, cx } = useStyles()
  const location = useLocation()
  const [active, setActive] = useState(location.pathname)
  const navigate = useNavigate()
  const hasLinks = Array.isArray(links)
  const [opened, setOpened] = useState(initiallyOpened || false)

  const items = (hasLinks ? links : []).map(link => (
    <Text<'a'>
      id={link.label === 'Resources' ? 'resource_list' : undefined}
      component="a"
      className={cx(classes.link, { [classes.linkActive]: link.link === active })}
      // href={link.link}
      onClick={() => {
        navigate(`${link.link}`)
        setActive(link.link)
      }}
      key={link.label}
    >
      <Tooltip label={link.label}>
        <link.icon className={classes.linkIcon} stroke={1.5} />
      </Tooltip>
      {link.label}
    </Text>
  ))

  useEffect(() => {
    if (location.pathname === '/community') {
      setActive(`${location.pathname}/communities/`)
    } else {
      setActive(location.pathname)
    }
  }, [location])

  return (
    <>
      <UnstyledButton onClick={() => setOpened(o => !o)} className={classes.control} />
      {hasLinks ? <Collapse in={opened}>{items}</Collapse> : null}
    </>
  )
}

const NavbarLinksGroup = () => {
  return (
    <Box
      sx={theme => ({
        minHeight: rem(220),
        padding: theme.spacing.md,
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white
      })}
    />
  )
}

export default NavbarLinksGroup
