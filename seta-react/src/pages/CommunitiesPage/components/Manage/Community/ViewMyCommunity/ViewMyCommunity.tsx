import { useEffect, useState } from 'react'
import {
  Anchor,
  Breadcrumbs,
  Button,
  Grid,
  Group,
  Paper,
  Text,
  Title,
  createStyles
} from '@mantine/core'
import { useParams } from 'react-router-dom'

import { useCommunityID } from '../../../../../../api/communities/manage/my-community'
import { environment } from '../../../../../../environments/environment'
import CommunitiesLoading from '../../../common/SuggestionsLoading'
import CommunityInvites from '../../Invites/CommunityInvites/CommunityInvites'
import CommunityResources from '../../Resource/CommunityResources/CommunityResources'
import Stats from '../Stats/Stats'

const useStyles = createStyles({
  title: {
    textAlign: 'left'
  },
  text: {
    textAlign: 'left'
  }
})
const ViewMyCommunity = () => {
  const { classes } = useStyles()
  const { id } = useParams()
  const [showInvites, setShowInvites] = useState(false)

  const { data, isLoading } = useCommunityID(id)
  const [row, setRow] = useState(data)

  const items = [
    { title: 'My Communities', href: `${environment.COMMUNITIES_API_PATH}/my-list` },
    { title: `${id}` }
  ].map(item => (
    <Anchor href={item.href} key={item.title}>
      {item.title}
    </Anchor>
  ))

  useEffect(() => {
    if (data) {
      setRow(data)
    }
  }, [data, row])

  if (isLoading || !data) {
    return <CommunitiesLoading />
  }

  const toggleListVisibility = show => {
    if (show) {
      setShowInvites(show)
    }
  }

  return (
    <>
      <Breadcrumbs>{items}</Breadcrumbs>
      <div className="page">
        <Grid grow>
          <Grid.Col span={12}>
            <Paper shadow="xs" p="md">
              <Title order={5} className={classes.title}>
                {row?.communities.title}
              </Title>
              <Text className={classes.text}>{row?.communities.description}</Text>
              <Group spacing={30} position="right">
                <Button
                  component="a"
                  href={`${environment.COMMUNITIES_API_PATH}/manage/${row?.communities.community_id}`}
                >
                  Manage
                </Button>
              </Group>
            </Paper>
          </Grid.Col>
          <Grid.Col span={1}>
            <Stats
              resourceNumber={row?.resources.length}
              inviteNumber={row?.invites.length}
              onChange={toggleListVisibility}
            />
          </Grid.Col>
          <Grid.Col span={5}>
            <CommunityResources data={row?.resources} />
          </Grid.Col>
          {showInvites ? (
            <Grid.Col span={12}>
              <CommunityInvites data={row?.invites} />
            </Grid.Col>
          ) : (
            ''
          )}
        </Grid>
      </div>
    </>
  )
}

export default ViewMyCommunity
