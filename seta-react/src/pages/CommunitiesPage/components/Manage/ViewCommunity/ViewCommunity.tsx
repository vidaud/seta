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
import CommunityResources from '../CommunityResources/CommunityResources'
import Stats from '../Stats/Stats'

const items = [
  { title: 'My Communities', href: 'http://localhost/communities/my-list' },
  { title: 'Update Community' }
].map((item, index) => (
  <Anchor href={item.href} key={index}>
    {item.title}
  </Anchor>
))

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
                {data.title}
              </Title>
              <Text className={classes.text}>{data.description}</Text>
              <Group spacing={30} position="right">
                <Button>Manage</Button>
              </Group>
            </Paper>
          </Grid.Col>
          <Grid.Col span={1}>
            <Stats />
          </Grid.Col>
          <Grid.Col span={5}>
            <CommunityResources />
          </Grid.Col>
        </Grid>
      </div>
    </>
  )
}

export default ViewCommunity
