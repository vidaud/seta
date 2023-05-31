import { useEffect, useState } from 'react'
import { Button, Grid, Group, Text, Title, createStyles, Card, Table } from '@mantine/core'
import { Link, useParams } from 'react-router-dom'

import { useCommunityID } from '../../../../../../api/communities/manage/my-community'
import ComponentLoading from '../../../common/ComponentLoading'
import CommunityResources from '../../Resource/CommunityResources/CommunityResources'
import Stats from '../Stats/Stats'

const useStyles = createStyles(theme => ({
  title: {
    textAlign: 'left'
  },
  text: {
    textAlign: 'left'
  },
  link: {
    color: 'white'
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
const ViewMyCommunity = () => {
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
                      Created at:{' '}
                      {row?.communities?.created_at
                        ? new Date(row?.communities.created_at).toDateString()
                        : null}
                    </Text>
                  </td>
                </tr>
              </tbody>
            </Table>
            <Group spacing={30} position="right">
              <Link
                className={classes.link}
                to={`/my-communities/${row?.communities.community_id}/manage`}
                replace={true}
              >
                <Button>Manage</Button>
              </Link>
            </Group>
          </Card>
        </Grid.Col>
        <Grid.Col span={1}>
          <Stats
            resourceNumber={row?.resources}
            inviteNumber={row?.invites}
            memberNumber={row?.members}
          />
        </Grid.Col>
        <Grid.Col span={5}>
          <CommunityResources data={row?.resources} />
        </Grid.Col>
      </Grid>
    </>
  )
}

export default ViewMyCommunity
