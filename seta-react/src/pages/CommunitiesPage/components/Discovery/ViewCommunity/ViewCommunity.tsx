import { useEffect, useState } from 'react'
import { Button, Grid, Group, Paper, Text, Title, createStyles } from '@mantine/core'
import { useParams } from 'react-router-dom'

import { useCommunityID } from '../../../../../api/communities/manage/my-community'
import ComponentLoading from '../../common/ComponentLoading'
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
  const [row, setRow] = useState(data)

  useEffect(() => {
    if (data) {
      setRow(data)
    }
  }, [data, row])

  if (isLoading || !data) {
    return <ComponentLoading />
  }

  return (
    <>
      <Grid grow>
        <Grid.Col span={12}>
          <Paper shadow="xs" p="md">
            <Title order={5} className={classes.title}>
              {row?.communities.title}
            </Title>
            <Text className={classes.text}>{row?.communities.description}</Text>
            <Group spacing={30} position="right">
              <Button size="xs">+ JOIN</Button>
            </Group>
          </Paper>
        </Grid.Col>
        <Grid.Col span={1}>
          <Stats resourceNumber={row?.resources} memberNumber={row?.members} />
        </Grid.Col>
        <Grid.Col span={5}>
          <CommunityResources data={row?.resources} />
        </Grid.Col>
      </Grid>
    </>
  )
}

export default ViewCommunity
