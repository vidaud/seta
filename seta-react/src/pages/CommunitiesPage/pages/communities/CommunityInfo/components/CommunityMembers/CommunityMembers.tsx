import { useEffect, useState } from 'react'
import {
  createStyles,
  Table,
  ScrollArea,
  rem,
  Title,
  Badge,
  useMantineTheme,
  Group
} from '@mantine/core'
import { useParams } from 'react-router-dom'

import DeleteMembership from './components/DeleteMembership/DeleteMembership'
import UpdateMembership from './components/UpdateMembership/UpdateMembership'

import { useMembershipID } from '../../../../../../../api/communities/membership'
import { ComponentEmpty, ComponentError, ComponentLoading } from '../../../../common'
import { useCommunityListContext } from '../../../../contexts/community-list.context'
import { jobColors } from '../../../../types'

const useStyles = createStyles(theme => ({
  header: {
    position: 'sticky',
    top: 0,
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    transition: 'box-shadow 150ms ease',

    '&::after': {
      content: '""',
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      borderBottom: `${rem(1)} solid ${
        theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[2]
      }`
    }
  },

  scrolled: {
    boxShadow: theme.shadows.sm
  },
  title: {
    paddingBottom: theme.spacing.xl
  }
}))

const CommunityMembers = () => {
  const { classes, cx } = useStyles()
  const [scrolled, setScrolled] = useState(false)
  const { id } = useParams()
  const { data, isLoading, error, refetch } = useMembershipID(id)
  const { community_scopes } = useCommunityListContext()
  const [scopes, setScopes] = useState<string[] | undefined>([])
  const [items, setItems] = useState(data)
  const theme = useMantineTheme()

  useEffect(() => {
    if (data) {
      setItems(data)
    }

    const findCommunity = community_scopes?.filter(scope => scope.community_id === id)

    findCommunity ? setScopes(findCommunity[0]?.scopes) : setScopes([])
  }, [data, items, community_scopes, id])

  const isManager =
    scopes?.includes('/seta/community/owner') || scopes?.includes('/seta/community/manager')

  if (error) {
    return <ComponentError onTryAgain={refetch} />
  }

  if (data) {
    if (data?.members.length === 0) {
      return <ComponentEmpty />
    }
  }

  if (isLoading || !data || !items) {
    return <ComponentLoading />
  }

  const rows =
    items && items?.members.length > 0
      ? items?.members.map(row => (
          <tr key={row.user_id}>
            <td>{row?.user_info?.full_name}</td>
            <td>
              <Badge
                color={jobColors[row.role.toLowerCase()]}
                variant={theme.colorScheme === 'dark' ? 'light' : 'outline'}
              >
                {row.role}
              </Badge>
            </td>
            <td>{row.community_id.charAt(0).toUpperCase() + row?.community_id.slice(1)}</td>
            <td>{new Date(row.join_date).toDateString()}</td>
            <td>{row.status.toUpperCase()}</td>
            <td>
              <Group spacing={0}>
                {isManager ? (
                  <>
                    <UpdateMembership props={row} />
                    <DeleteMembership props={row} />
                  </>
                ) : null}
              </Group>
            </td>
          </tr>
        ))
      : []

  return (
    <>
      <Title className={cx(classes.title)} order={3}>
        List of Members
      </Title>
      <ScrollArea h={300} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
        <Table miw={500}>
          <thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Community</th>
              <th>Join Date</th>
              <th>Status</th>
              {scopes?.includes('/seta/community/manager') ? <th>Actions</th> : null}
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </ScrollArea>
    </>
  )
}

export default CommunityMembers
