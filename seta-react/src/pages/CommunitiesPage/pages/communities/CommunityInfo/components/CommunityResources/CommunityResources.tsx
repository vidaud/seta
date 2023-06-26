import { useEffect, useState } from 'react'
import {
  ScrollArea,
  Badge,
  Text,
  Grid,
  Paper,
  Group,
  Tooltip,
  createStyles,
  Button
} from '@mantine/core'
import { ImBlocked } from 'react-icons/im'
import { VscLayersActive } from 'react-icons/vsc'
import { Link } from 'react-router-dom'

import type { ResourceResponse } from '~/api/types/resource-types'

import { useMyCommunityResources } from '../../../../../../../api/communities/manage/my-community'
import { ComponentEmpty, ComponentError, ComponentLoading } from '../../../../../components/common'

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

const CommunityResources = ({ id, scopes, nrResources }) => {
  const { data, isLoading, error, refetch } = useMyCommunityResources(id)
  const [items, setItems] = useState<ResourceResponse[]>()
  const { classes } = useStyles()

  useEffect(() => {
    if (data) {
      setItems(data)
      nrResources(data?.length)
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

  const rows = items?.map(row => (
    <Grid.Col key={row?.resource_id}>
      <Paper withBorder p="md" radius="md" className={classes.row}>
        <Group>
          <Text sx={{ width: '73%' }}>
            <Text size="md">{row?.title.charAt(0).toUpperCase() + row?.title.slice(1)}</Text>
          </Text>
          <Group>
            <Text size="xs">{new Date(row?.created_at).toDateString()}</Text>
            {row.status === 'active' ? (
              <Tooltip label="Active" position="bottom" color="green">
                <Badge variant="outline" color="green" w="min-content" className={classes.badge}>
                  <VscLayersActive />
                </Badge>
              </Tooltip>
            ) : (
              <Tooltip label="Blocked" position="bottom" color="red">
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
    <ScrollArea w="content">
      {scopes?.includes('/seta/resource/create') ? (
        <Group position="right">
          <Tooltip label="Add new resource to this community">
            <Link to={`/my-communities/${id}/new`} replace={true}>
              <Button className={classes.button} size="xs" color="blue" variant="outline">
                + Resource
              </Button>
            </Link>
          </Tooltip>
        </Group>
      ) : null}
      <Grid>{rows}</Grid>
    </ScrollArea>
  )
}

export default CommunityResources
