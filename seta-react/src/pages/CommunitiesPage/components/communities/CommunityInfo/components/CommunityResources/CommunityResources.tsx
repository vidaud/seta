import { useEffect, useState } from 'react'
import { Badge, Text, Grid, Paper, Group, Tooltip, createStyles } from '@mantine/core'
import { ImBlocked } from 'react-icons/im'
import { VscLayersActive } from 'react-icons/vsc'
import { useNavigate } from 'react-router-dom'

import DateTimeCell from '~/pages/Admin/common/components/DateTimeCell/DateTimeCell'
import {
  ComponentEmpty,
  ComponentError,
  ComponentLoading
} from '~/pages/CommunitiesPage/components/common'

import { useMyCommunityResources } from '~/api/communities/manage/my-community'
import type { ResourceResponse } from '~/api/types/resource-types'

const useStyles = createStyles(theme => ({
  row: {
    '&:hover': {
      background: '#f8f9fa',
      cursor: 'pointer'
    }
  },
  badge: {
    '&:hover': {
      color: 'green'
    }
  },
  button: {
    marginBottom: theme.spacing.xs
  }
}))

const CommunityResources = ({ id }) => {
  const { data, isLoading, error, refetch } = useMyCommunityResources(id)
  const [items, setItems] = useState<ResourceResponse[]>()
  const { classes } = useStyles()
  // const { scrollTargetRef } = useScroller({ resetPageDependencies: [id] })
  const navigate = useNavigate()

  useEffect(() => {
    if (data) {
      setItems(data)
    }
  }, [data, items])

  if (error) {
    return <ComponentError onTryAgain={refetch} />
  }

  if (data) {
    if (items?.length === 0) {
      return <ComponentEmpty />
    }
  }

  if (isLoading || !data) {
    return <ComponentLoading />
  }

  const handleCommunityRedirection = (row: ResourceResponse) => {
    navigate(`/community/resources/#${row.resource_id}`)
  }

  const rows =
    items &&
    items?.map(row => (
      <Grid.Col
        key={row?.resource_id}
        onClick={() => handleCommunityRedirection(row)}
        // ref={scrollTargetRef}
      >
        <Paper withBorder p="md" radius="md" className={classes.row}>
          <Group>
            <Text sx={{ width: '73%' }}>
              <Text size="md">{row?.title.charAt(0).toUpperCase() + row?.title.slice(1)}</Text>
            </Text>
            <Group>
              <DateTimeCell dateTime={row?.created_at} />
              {row.status === 'active' ? (
                <Tooltip label="Active" color="green">
                  <Badge variant="outline" color="green" w="min-content" className={classes.badge}>
                    <VscLayersActive />
                  </Badge>
                </Tooltip>
              ) : (
                <Tooltip label="Blocked" color="red">
                  <Badge variant="outline" color="red" w="min-content" className={classes.badge}>
                    <ImBlocked />
                  </Badge>
                </Tooltip>
              )}
            </Group>
          </Group>
          <Text size="sm">{row?.abstract.charAt(0).toUpperCase() + row?.abstract.slice(1)}</Text>
        </Paper>
      </Grid.Col>
    ))

  return (
    // <ScrollArea w="content">
    <Grid>{rows}</Grid>
    // </ScrollArea>
  )
}

export default CommunityResources
