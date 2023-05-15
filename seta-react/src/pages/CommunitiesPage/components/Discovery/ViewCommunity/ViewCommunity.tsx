import { useEffect } from 'react'
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

import { useCommunityID } from '../../../../../api/communities/community'
import CommunitiesLoading from '../../common/SuggestionsLoading'
import CommunityResources from '../../Manage/Resource/CommunityResources/CommunityResources'
import Stats from '../Stats/Stats'

const useStyles = createStyles({
  title: {
    textAlign: 'left'
  },
  text: {
    textAlign: 'left'
  }
})
const ViewCommunity = () => {
  const { classes } = useStyles()
  const { id } = useParams()

  const { data, isLoading } = useCommunityID(id)

  const items = [
    { title: 'My Communities', href: 'http://localhost/communities/my-list' },
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
                <Button size="xs">+ JOIN</Button>
              </Group>
            </Paper>
          </Grid.Col>
          <Grid.Col span={1}>
            <Stats resourceNumber={data.resources.length} />
          </Grid.Col>
          <Grid.Col span={5}>
            <CommunityResources data={data.resources} />
          </Grid.Col>
        </Grid>
      </div>
    </>
  )
}

export default ViewCommunity
