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

import { useCommunityID } from '../../../../../../api/communities/community'
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

  const items = [
    { title: 'My Communities', href: `${environment.COMMUNITIES_API_PATH}/my-list` },
    { title: `${id}` }
  ].map((item, index) => (
    <Anchor href={item.href} key={index}>
      {item.title}
    </Anchor>
  ))

  useEffect(() => {
    if (data) {
      console.log(data)
    }
  }, [data])

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
                {data.communities.title}
              </Title>
              <Text className={classes.text}>{data.communities.description}</Text>
              <Group spacing={30} position="right">
                <Button
                  component="a"
                  href={`${environment.COMMUNITIES_API_PATH}/manage/${data.communities.community_id}`}
                >
                  Manage
                </Button>
              </Group>
            </Paper>
          </Grid.Col>
          <Grid.Col span={1}>
            <Stats
              resourceNumber={data.resources.length}
              inviteNumber={data.invites.length}
              onChange={toggleListVisibility}
            />
          </Grid.Col>
          <Grid.Col span={5}>
            <CommunityResources data={data.resources} />
          </Grid.Col>
          {showInvites ? (
            <Grid.Col span={12}>
              <CommunityInvites data={data.invites} />
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
