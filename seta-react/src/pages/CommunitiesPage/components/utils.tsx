import { createStyles, Text, rem, UnstyledButton, Group, Center } from '@mantine/core'
import { keys } from '@mantine/utils'
import { IconSelector, IconChevronDown, IconChevronUp } from '@tabler/icons-react'

import type { Community } from '~/models/communities/communities'

import type { ThProps } from './types'

const useStyles = createStyles(theme => ({
  th: {
    padding: '0 !important'
  },

  control: {
    width: '100%',
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0]
    }
  },

  icon: {
    width: rem(21),
    height: rem(21),
    borderRadius: rem(21)
  }
}))

export const Th = ({ children, reversed, sorted, onSort }: ThProps) => {
  const { classes } = useStyles()
  const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector

  return (
    <th className={classes.th}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group position="apart">
          <Text fw={500} fz="sm">
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon size="0.9rem" stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </th>
  )
}

export const filterData = (data: Community[], search: string) => {
  const query = search.toLowerCase().trim()

  return data.filter(item =>
    keys(data[0]).some(key => item[key].toString().toLowerCase().includes(query))
  )
}

export const sortData = (
  data: Community[],
  payload: { sortBy: keyof Community | null; reversed: boolean; search: string }
) => {
  const { sortBy } = payload

  if (!sortBy) {
    return filterData(data, payload.search)
  }

  return filterData(
    [...data].sort((a, b) => {
      if (payload.reversed) {
        return b[sortBy.toString()].localeCompare(a[sortBy.toString()])
      }

      return a[sortBy.toString()].localeCompare(b[sortBy].toString())
    }),
    payload.search
  )
}
