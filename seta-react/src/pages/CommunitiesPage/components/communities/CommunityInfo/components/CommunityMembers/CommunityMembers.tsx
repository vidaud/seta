import { useEffect, useState } from 'react'
import { Table, ScrollArea, Title, Badge, useMantineTheme, Group } from '@mantine/core'
import { useParams } from 'react-router-dom'

import {
  ComponentEmpty,
  ComponentError,
  ComponentLoading
} from '~/pages/CommunitiesPage/components/common'
import { useCommunityListContext } from '~/pages/CommunitiesPage/contexts/community-list.context'
import { jobColors } from '~/pages/CommunitiesPage/types'

import { useMembershipID } from '~/api/communities/memberships/membership'

import DeleteMembership from './components/DeleteMembership'
import UpdateMembership from './components/UpdateMembership'
import { useStyles } from './style'

const CommunityMembers = () => {
  const { classes, cx } = useStyles()
  const [scrolled, setScrolled] = useState(false)
  const { id } = useParams()
  const { data, isLoading, error, refetch } = useMembershipID(id ? id : '')
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
    if (data?.length === 0) {
      return <ComponentEmpty />
    }
  }

  if (isLoading || !data || !items) {
    return <ComponentLoading />
  }

  const rows =
    items && items?.length > 0
      ? items?.map(row => (
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
    <div style={{ overflowX: 'auto' }}>
      <Title className={cx(classes.title)} order={3}>
        List of Members
      </Title>
      <ScrollArea h={300} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
        <Table>
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
    </div>
  )
}

export default CommunityMembers
