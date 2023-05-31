import { useEffect, useState } from 'react'
import { Button, Card, Grid, Group, Text, Title, createStyles, Table } from '@mantine/core'
import { useParams } from 'react-router-dom'

import { useCommunityID } from '../../../../../api/communities/manage/my-community'
import ComponentLoading from '../../common/ComponentLoading'
import CommunityResources from '../../Manage/Resource/CommunityResources/CommunityResources'
import Stats from '../Stats/Stats'

const useStyles = createStyles(theme => ({
  title: {
    textAlign: 'left'
  },
  text: {
    textAlign: 'left'
  },
  imageSection: {
    background: '#D9D9D9',
    padding: theme.spacing.sm,
    color: '#000000'
  },
  table: {
    width: '100%',
    paddingTop: theme.spacing.md
  },
  td: {
    width: '50%'
  }
}))
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
          <Card withBorder radius="md">
            <Card.Section className={classes.imageSection}>
              <Text size="md">Details</Text>
            </Card.Section>
            <Title order={5} className={classes.title}>
              {row?.communities.title}
            </Title>
            <Text size="xs" className={classes.text}>
              {row?.communities.description}
            </Text>
            <Table className={classes.table}>
              <tbody>
                <tr>
                  <td className={classes.td}>
                    <Text className={classes.text}>Members: {row?.members.length}</Text>
                  </td>
                  <td className={classes.td}>
                    <Text className={classes.text}>Status: {row?.communities.status}</Text>
                  </td>
                </tr>
                <tr>
                  <td className={classes.td}>
                    <Text className={classes.text}>
                      Created by: {row?.communities.creator.user_id}
                    </Text>
                  </td>
                  <td className={classes.td}>
                    <Text className={classes.text}>
                      Created at: {row?.communities.created_at.toString()}
                    </Text>
                  </td>
                </tr>
              </tbody>
            </Table>
            <Group spacing={30} position="right">
              <Button variant="filled" size="xs">
                + JOINED
              </Button>
            </Group>
          </Card>
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
